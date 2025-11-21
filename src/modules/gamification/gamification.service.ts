import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    private lessonsService: LessonsService,
  ) {}

  // Calculate level from XP
  getLevelFromXp(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  // Get rank based on level
  getRank(level: number, locale: 'en' | 'vi'): string {
    const ranks = {
      en: {
        novice: 'Trail Seeker',
        apprentice: 'Trail Walker',
        journeyman: 'Trail Maker',
        adept: 'Trail Guide',
        pro: 'Trail Blazer',
        master: 'Trail Master',
        virtuoso: 'Trail Legend',
      },
      vi: {
        novice: 'Người Tìm Đường',
        apprentice: 'Người Đi Trail',
        journeyman: 'Người Làm Trail',
        adept: 'Người Dẫn Trail',
        pro: 'Người Chinh Phục Trail',
        master: 'Bậc Thầy Trail',
        virtuoso: 'Huyền Thoại Trail',
      },
    };

    const localeRanks = ranks[locale];

    if (level <= 5) return localeRanks.novice;
    if (level <= 10) return localeRanks.apprentice;
    if (level <= 15) return localeRanks.journeyman;
    if (level <= 20) return localeRanks.adept;
    if (level <= 25) return localeRanks.pro;
    if (level <= 30) return localeRanks.master;
    return localeRanks.virtuoso;
  }

  // Award XP to a user with anti-farming protection
  async awardXp(userId: string, amount: number, eventKey?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if this XP event has already been awarded (anti-farming)
    if (eventKey) {
      const existingXpEvent = await this.prisma.xpEvent.findUnique({
        where: {
          userId_eventKey: {
            user_id: userId,
            event_key: eventKey,
          },
        },
      });

      if (existingXpEvent) {
        // XP already awarded for this event, return current state
        return {
          user,
          leveledUp: false,
          newLevel: user.level,
          oldLevel: user.level,
          xpAwarded: 0,
          alreadyAwarded: true,
        };
      }

      // Record this XP event
      await this.prisma.xpEvent.create({
        data: {
          user_id: userId,
          event_key: eventKey,
          xp_awarded: amount,
          awarded_at: new Date(),
        },
      });
    }

    const newXp = user.xp + amount;
    const oldLevel = user.level;
    const newLevel = this.getLevelFromXp(newXp);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    return {
      user: updated,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel,
      oldLevel: oldLevel,
      xpAwarded: amount,
      alreadyAwarded: false,
    };
  }

  // Update streak
  async updateStreak(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastLogin = user.last_login.toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = user.streak;

    if (lastLogin === today) {
      // Already logged in today, no change
      return { streak: newStreak, isConsecutive: true };
    } else if (lastLogin === yesterday) {
      // Consecutive day
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const longestStreak = Math.max(user.longest_streak || 0, newStreak);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        longest_streak: longestStreak,
        last_login: new Date(),
      },
    });

    return {
      streak: newStreak,
      isConsecutive: lastLogin === yesterday,
      longestStreak,
    };
  }

  // Get user gamification stats
  async getStats(userId: string, locale: 'en' | 'vi' = 'en') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lesson_progress: {
          where: { completed: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const completionStats = await this.lessonsService.getCompletionStats(userId);
    const rank = this.getRank(user.level, locale);

    return {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      longestStreak: user.longest_streak || user.streak,
      rank,
      completedLessons: completionStats.completedLessons,
      totalLessons: completionStats.totalLessons,
      completionPercentage: completionStats.completionPercentage,
    };
  }

  // Generate certificate
  async generateCertificate(userId: string, locale: 'en' | 'vi' = 'en') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lesson_progress: {
          where: { completed: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const completionStats = await this.lessonsService.getCompletionStats(userId);

    // Check if user has completed all lessons
    if (completionStats.completedLessons < completionStats.totalLessons) {
      throw new Error('User has not completed all lessons yet');
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findUnique({
      where: { user_id: userId },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Generate certificate number
    const certificateNumber = `TRAILIX-${Date.now()}-${userId.substring(0, 8).toUpperCase()}`;
    const rank = this.getRank(user.level, locale);

    const certificate = await this.prisma.certificate.create({
      data: {
        user_id: userId,
        certificate_number: certificateNumber,
        name: user.name || user.email.split('@')[0],
        start_date: user.course_start_date,
        completion_date: new Date(),
        checkpoints: completionStats.completedLessons,
        total_checkpoints: completionStats.totalLessons,
        rank,
        total_xp: user.xp,
        longest_streak: user.longest_streak || user.streak,
      },
    });

    return certificate;
  }

  // Get user certificate
  async getCertificate(userId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { user_id: userId },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  // Verify certificate by certificate number
  async verifyCertificate(certificateNumber: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificate_number: certificateNumber },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }
}

