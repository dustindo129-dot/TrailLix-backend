import { LessonsService } from './lessons.service';
import { SaveLessonAttemptDto, SavePersonalizedContentDto } from './dto';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    findAll(): Promise<import("../../data/types").Lesson[]>;
    findOne(id: number): Promise<import("../../data/types").Lesson>;
    getProgress(id: number, req: any): Promise<{
        id: string;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        completed: boolean;
        completed_at: Date | null;
    }>;
    getAllProgress(req: any): Promise<({
        lesson: {
            id: number;
            created_at: Date;
            updated_at: Date;
            order_index: number;
            title_en: string;
            title_vi: string;
            category_en: string;
            category_vi: string;
        };
    } & {
        id: string;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        completed: boolean;
        completed_at: Date | null;
    })[]>;
    markComplete(id: number, req: any): Promise<{
        id: string;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        completed: boolean;
        completed_at: Date | null;
    }>;
    getAttempt(id: number, req: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        simple_prompt: string | null;
        simple_evaluation_score: number | null;
        simple_evaluation_feedback: string | null;
        simple_evaluation_suggestion: string | null;
        simple_is_complete: boolean;
        personalized_prompt: string | null;
        personalized_evaluation_score: number | null;
        personalized_evaluation_feedback: string | null;
        personalized_evaluation_suggestion: string | null;
        personalized_is_complete: boolean;
        sample_response: string | null;
        visited_stages: string[];
    }>;
    saveAttempt(id: number, attemptData: SaveLessonAttemptDto, req: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        simple_prompt: string | null;
        simple_evaluation_score: number | null;
        simple_evaluation_feedback: string | null;
        simple_evaluation_suggestion: string | null;
        simple_is_complete: boolean;
        personalized_prompt: string | null;
        personalized_evaluation_score: number | null;
        personalized_evaluation_feedback: string | null;
        personalized_evaluation_suggestion: string | null;
        personalized_is_complete: boolean;
        sample_response: string | null;
        visited_stages: string[];
    }>;
    getPersonalizedContent(id: number, locale: 'en' | 'vi', req: any): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        lesson_id: number;
        locale: string;
        real_world_scenario: string;
        personalized_exercise: string;
        application_guide: string;
        full_prompt: string;
        components: import("@prisma/client/runtime/library").JsonValue;
    }>;
    savePersonalizedContent(id: number, locale: 'en' | 'vi', content: SavePersonalizedContentDto, req: any): Promise<{
        id: string;
        created_at: Date;
        user_id: string;
        lesson_id: number;
        locale: string;
        real_world_scenario: string;
        personalized_exercise: string;
        application_guide: string;
        full_prompt: string;
        components: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getCompletionStats(req: any): Promise<{
        totalLessons: number;
        completedLessons: number;
        completionPercentage: number;
    }>;
}
