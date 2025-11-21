import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        data: {
            id: string;
            external_auth_id: string | null;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar_url: string | null;
            email_verified: boolean;
            xp: number;
            level: number;
            streak: number;
            longest_streak: number;
            last_login: Date;
            age_range: string | null;
            role_description: string | null;
            ai_experience: string | null;
            skills: string[];
            achievement: string | null;
            fields: string[];
            motivations: string[];
            course_start_date: Date | null;
            has_seen_concepts_intro: boolean;
            has_seen_evaluation_onboarding: boolean;
            free_lessons_used: number;
            subscription_status: import(".prisma/client").$Enums.SubscriptionStatus;
            subscription_end_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    updateProfile(req: any, updateData: {
        name?: string;
        avatar_url?: string;
        age_range?: string;
        role_description?: string;
        ai_experience?: string;
        skills?: string[];
        achievement?: string;
        fields?: string[];
        motivations?: string[];
        course_start_date?: string;
        has_seen_concepts_intro?: boolean;
    }): Promise<{
        data: {
            id: string;
            external_auth_id: string | null;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar_url: string | null;
            email_verified: boolean;
            xp: number;
            level: number;
            streak: number;
            longest_streak: number;
            last_login: Date;
            age_range: string | null;
            role_description: string | null;
            ai_experience: string | null;
            skills: string[];
            achievement: string | null;
            fields: string[];
            motivations: string[];
            course_start_date: Date | null;
            has_seen_concepts_intro: boolean;
            has_seen_evaluation_onboarding: boolean;
            free_lessons_used: number;
            subscription_status: import(".prisma/client").$Enums.SubscriptionStatus;
            subscription_end_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
