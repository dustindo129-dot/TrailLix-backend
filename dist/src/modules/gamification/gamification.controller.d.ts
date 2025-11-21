import { GamificationService } from './gamification.service';
import { AwardXpDto } from './dto';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    awardXp(dto: AwardXpDto, req: any): Promise<{
        user: {
            id: string;
            external_auth_id: string | null;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar_url: string | null;
            password_hash: string | null;
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
        leveledUp: boolean;
        newLevel: number;
        oldLevel: number;
        xpAwarded: number;
        alreadyAwarded: boolean;
    }>;
    updateStreak(req: any): Promise<{
        streak: number;
        isConsecutive: boolean;
        longestStreak?: undefined;
    } | {
        streak: number;
        isConsecutive: boolean;
        longestStreak: number;
    }>;
    getStats(locale: 'en' | 'vi', req: any): Promise<{
        xp: number;
        level: number;
        streak: number;
        longestStreak: number;
        rank: string;
        completedLessons: number;
        totalLessons: number;
        completionPercentage: number;
    }>;
    generateCertificate(locale: 'en' | 'vi', req: any): Promise<{
        id: string;
        name: string;
        longest_streak: number;
        created_at: Date;
        user_id: string;
        start_date: Date | null;
        certificate_number: string;
        completion_date: Date;
        checkpoints: number;
        total_checkpoints: number;
        rank: string;
        total_xp: number;
    }>;
    getCertificate(req: any): Promise<{
        id: string;
        name: string;
        longest_streak: number;
        created_at: Date;
        user_id: string;
        start_date: Date | null;
        certificate_number: string;
        completion_date: Date;
        checkpoints: number;
        total_checkpoints: number;
        rank: string;
        total_xp: number;
    }>;
    verifyCertificate(certificateNumber: string): Promise<{
        user: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        longest_streak: number;
        created_at: Date;
        user_id: string;
        start_date: Date | null;
        certificate_number: string;
        completion_date: Date;
        checkpoints: number;
        total_checkpoints: number;
        rank: string;
        total_xp: number;
    }>;
}
