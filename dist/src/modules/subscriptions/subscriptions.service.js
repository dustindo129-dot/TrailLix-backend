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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const FREE_LESSONS_LIMIT = 20;
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkLessonAccess(userId, lessonOrderIndex) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                free_lessons_used: true,
                subscription_status: true,
                subscription_end_date: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.subscription_status === client_1.SubscriptionStatus.ACTIVE) {
            if (user.subscription_end_date && user.subscription_end_date < new Date()) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { subscription_status: client_1.SubscriptionStatus.CANCELLED },
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
        const freeLessonsUsed = user.free_lessons_used;
        return {
            hasAccess: false,
            reason: `You've used all ${FREE_LESSONS_LIMIT} free lessons. Subscribe to continue learning!`,
            freeLessonsRemaining: 0,
            subscriptionStatus: user.subscription_status,
        };
    }
    async markLessonCompleted(userId, lessonId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                free_lessons_used: true,
                subscription_status: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.subscription_status !== client_1.SubscriptionStatus.ACTIVE) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    free_lessons_used: Math.min(user.free_lessons_used + 1, FREE_LESSONS_LIMIT),
                },
            });
        }
    }
    async createSubscription(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const endDate = new Date(dto.end_date);
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
                status: client_1.SubscriptionStatus.ACTIVE,
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscription_status: client_1.SubscriptionStatus.ACTIVE,
                subscription_end_date: endDate,
            },
        });
        return subscription;
    }
    async getUserSubscription(userId) {
        const [activeSubscription, user] = await Promise.all([
            this.prisma.subscription.findFirst({
                where: {
                    user_id: userId,
                    status: client_1.SubscriptionStatus.ACTIVE,
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
            throw new common_1.BadRequestException('User not found');
        }
        return {
            subscription: activeSubscription,
            freeLessonsUsed: user.free_lessons_used,
            freeLessonsRemaining: Math.max(0, FREE_LESSONS_LIMIT - user.free_lessons_used),
            subscriptionStatus: user.subscription_status,
            subscriptionEndDate: user.subscription_end_date,
        };
    }
    async getUserSubscriptionHistory(userId) {
        return await this.prisma.subscription.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
    async cancelSubscription(userId, subscriptionId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!subscription || subscription.user_id !== userId) {
            throw new common_1.BadRequestException('Subscription not found');
        }
        const updated = await this.prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: client_1.SubscriptionStatus.CANCELLED,
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                subscription_status: client_1.SubscriptionStatus.CANCELLED,
            },
        });
        return updated;
    }
    async getAllSubscriptions(page = 1, limit = 50) {
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
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map