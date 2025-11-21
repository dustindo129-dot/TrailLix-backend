import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    checkLessonAccess(req: any, lessonOrderIndex: number): Promise<import("./dto").LessonAccessResponse>;
    getMySubscription(req: any): Promise<{
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
    getMyHistory(req: any): Promise<{
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
    createSubscription(req: any, dto: CreateSubscriptionDto): Promise<{
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
    cancelSubscription(req: any, subscriptionId: string): Promise<{
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
