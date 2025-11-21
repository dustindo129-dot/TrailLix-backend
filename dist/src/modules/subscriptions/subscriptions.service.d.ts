import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSubscriptionDto, LessonAccessResponse } from './dto';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    checkLessonAccess(userId: string, lessonOrderIndex: number): Promise<LessonAccessResponse>;
    markLessonCompleted(userId: string, lessonId: number): Promise<void>;
    createSubscription(userId: string, dto: CreateSubscriptionDto): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        plan_type: string;
        amount: number;
        currency: import(".prisma/client").$Enums.Currency;
        payment_method: string | null;
        transaction_id: string | null;
        end_date: Date;
        auto_renew: boolean;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        start_date: Date;
    }>;
    getUserSubscription(userId: string): Promise<{
        subscription: {
            id: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            plan_type: string;
            amount: number;
            currency: import(".prisma/client").$Enums.Currency;
            payment_method: string | null;
            transaction_id: string | null;
            end_date: Date;
            auto_renew: boolean;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            start_date: Date;
        };
        freeLessonsUsed: number;
        freeLessonsRemaining: number;
        subscriptionStatus: import(".prisma/client").$Enums.SubscriptionStatus;
        subscriptionEndDate: Date;
    }>;
    getUserSubscriptionHistory(userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        plan_type: string;
        amount: number;
        currency: import(".prisma/client").$Enums.Currency;
        payment_method: string | null;
        transaction_id: string | null;
        end_date: Date;
        auto_renew: boolean;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        start_date: Date;
    }[]>;
    cancelSubscription(userId: string, subscriptionId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        plan_type: string;
        amount: number;
        currency: import(".prisma/client").$Enums.Currency;
        payment_method: string | null;
        transaction_id: string | null;
        end_date: Date;
        auto_renew: boolean;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        start_date: Date;
    }>;
    getAllSubscriptions(page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            user_id: string;
            plan_type: string;
            amount: number;
            currency: import(".prisma/client").$Enums.Currency;
            payment_method: string | null;
            transaction_id: string | null;
            end_date: Date;
            auto_renew: boolean;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            start_date: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
