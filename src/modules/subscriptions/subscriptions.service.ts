import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { CreateSubscriptionDto, LessonAccessResponse } from './dto';

const FREE_LESSONS_LIMIT = 20;

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if a user has access to a specific lesson
   */
  async checkLessonAccess(userId: string, lessonOrderIndex: number): Promise<LessonAccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        free_lessons_used: true,
        subscription_status: true,
        subscription_end_date: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user has active subscription
    if (user.subscription_status === SubscriptionStatus.ACTIVE) {
      // Check if subscription has expired
      if (user.subscription_end_date && user.subscription_end_date < new Date()) {
        // Subscription expired, update status
        await this.prisma.user.update({
          where: { id: userId },
          data: { subscription_status: SubscriptionStatus.CANCELLED },
        });

        return {
          hasAccess: false,
          reason: 'Subscription has expired. Please renew to continue.',
          subscriptionStatus: 'EXPIRED',
        };
      }

      return {
        hasAccess: true,
        subscriptionStatus: user.subscription_status,
        subscriptionEndDate: user.subscription_end_date || undefined,
      };
    }

    // No active subscription - check free lessons
    if (lessonOrderIndex <= FREE_LESSONS_LIMIT) {
      const freeLessonsRemaining = Math.max(0, FREE_LESSONS_LIMIT - user.free_lessons_used);
      
      if (user.free_lessons_used < FREE_LESSONS_LIMIT) {
        return {
          hasAccess: true,
          reason: 'Using free lesson access',
          freeLessonsRemaining,
          subscriptionStatus: 'INACTIVE',
        };
      }
    }

    // No access
    const freeLessonsUsed = user.free_lessons_used;
    return {
      hasAccess: false,
      reason: `You've used all ${FREE_LESSONS_LIMIT} free lessons. Subscribe to continue learning!`,
      freeLessonsRemaining: 0,
      subscriptionStatus: user.subscription_status,
    };
  }

  /**
   * Mark a lesson as completed and increment free lessons used if applicable
   */
  async markLessonCompleted(userId: string, lessonId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        free_lessons_used: true,
        subscription_status: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // If user doesn't have active subscription, increment free lessons used
    if (user.subscription_status !== SubscriptionStatus.ACTIVE) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          free_lessons_used: Math.min(user.free_lessons_used + 1, FREE_LESSONS_LIMIT),
        },
      });
    }
  }

  /**
   * Create a new subscription for a user
   */
  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const endDate = new Date(dto.end_date);

    // Create subscription record
    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: userId,
        plan_type: dto.plan_type,
        amount: dto.amount,
        currency: dto.currency || 'VND',
        payment_method: dto.payment_method,
        transaction_id: dto.transaction_id,
        end_date: endDate,
        auto_renew: dto.auto_renew || false,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // Update user subscription status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription_status: SubscriptionStatus.ACTIVE,
        subscription_end_date: endDate,
      },
    });

    return subscription;
  }

  /**
   * Get user's current subscription info
   */
  async getUserSubscription(userId: string) {
    const [activeSubscription, user] = await Promise.all([
      this.prisma.subscription.findFirst({
        where: {
          user_id: userId,
          status: SubscriptionStatus.ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          free_lessons_used: true,
          subscription_status: true,
          subscription_end_date: true,
        },
      }),
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      subscription: activeSubscription,
      freeLessonsUsed: user.free_lessons_used,
      freeLessonsRemaining: Math.max(0, FREE_LESSONS_LIMIT - user.free_lessons_used),
      subscriptionStatus: user.subscription_status,
      subscriptionEndDate: user.subscription_end_date,
    };
  }

  /**
   * Get all subscriptions for a user (history)
   */
  async getUserSubscriptionHistory(userId: string) {
    return await this.prisma.subscription.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Cancel a user's subscription
   */
  async cancelSubscription(userId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription || subscription.user_id !== userId) {
      throw new BadRequestException('Subscription not found');
    }

    // Update subscription status
    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCELLED,
      },
    });

    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription_status: SubscriptionStatus.CANCELLED,
      },
    });

    return updated;
  }

  /**
   * Admin: Get all subscriptions
   */
  async getAllSubscriptions(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.subscription.count(),
    ]);

    return {
      data: subscriptions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

