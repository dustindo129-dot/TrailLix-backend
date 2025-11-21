"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const lessons_service_1 = require("../lessons/lessons.service");
let GamificationService = class GamificationService {
    constructor(prisma, lessonsService) {
        this.prisma = prisma;
        this.lessonsService = lessonsService;
    }
    getLevelFromXp(xp) {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
    getRank(level, locale) {
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
        if (level <= 5)
            return localeRanks.novice;
        if (level <= 10)
            return localeRanks.apprentice;
        if (level <= 15)
            return localeRanks.journeyman;
        if (level <= 20)
            return localeRanks.adept;
        if (level <= 25)
            return localeRanks.pro;
        if (level <= 30)
            return localeRanks.master;
        return localeRanks.virtuoso;
    }
    async awardXp(userId, amount, eventKey) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
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
                return {
                    user,
                    leveledUp: false,
                    newLevel: user.level,
                    oldLevel: user.level,
                    xpAwarded: 0,
                    alreadyAwarded: true,
                };
            }
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
    async updateStreak(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = user.last_login.toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = user.streak;
        if (lastLogin === today) {
            return { streak: newStreak, isConsecutive: true };
        }
        else if (lastLogin === yesterday) {
            newStreak += 1;
        }
        else {
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
    async getStats(userId, locale = 'en') {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lesson_progress: {
                    where: { completed: true },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async generateCertificate(userId, locale = 'en') {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lesson_progress: {
                    where: { completed: true },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const completionStats = await this.lessonsService.getCompletionStats(userId);
        if (completionStats.completedLessons < completionStats.totalLessons) {
            throw new Error('User has not completed all lessons yet');
        }
        const existingCertificate = await this.prisma.certificate.findUnique({
            where: { user_id: userId },
        });
        if (existingCertificate) {
            return existingCertificate;
        }
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
    async getCertificate(userId) {
        const certificate = await this.prisma.certificate.findUnique({
            where: { user_id: userId },
        });
        if (!certificate) {
            throw new common_1.NotFoundException('Certificate not found');
        }
        return certificate;
    }
    async verifyCertificate(certificateNumber) {
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
            throw new common_1.NotFoundException('Certificate not found');
        }
        return certificate;
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        lessons_service_1.LessonsService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map