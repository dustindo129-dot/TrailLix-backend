import { Currency } from '@prisma/client';
export declare class CreateSubscriptionDto {
    plan_type: string;
    amount: number;
    currency?: Currency;
    payment_method?: string;
    transaction_id?: string;
    end_date: string;
    auto_renew?: boolean;
}
