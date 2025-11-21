import { PrismaService } from '../../common/prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import type { Lesson } from '../../data/types';
export declare class LessonsService {
    private prisma;
    private subscriptionsService;
    constructor(prisma: PrismaService, subscriptionsService: SubscriptionsService);
    findAll(): Promise<Lesson[]>;
    findOne(id: number): Promise<Lesson>;
    getUserProgress(userId: string, lessonId: number): Promise<{
        id: string;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        completed: boolean;
        completed_at: Date | null;
    }>;
    getUserAllProgress(userId: string): Promise<({
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
    markLessonComplete(userId: string, lessonId: number): Promise<{
        id: string;
        updated_at: Date;
        user_id: string;
        lesson_id: number;
        completed: boolean;
        completed_at: Date | null;
    }>;
    getLessonAttempt(userId: string, lessonId: number): Promise<{
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
    saveLessonAttempt(userId: string, lessonId: number, attemptData: {
        simplePrompt?: string;
        simpleEvaluationScore?: number;
        simpleEvaluationFeedback?: string;
        simpleEvaluationSuggestion?: string;
        simpleIsComplete?: boolean;
        personalizedPrompt?: string;
        personalizedEvaluationScore?: number;
        personalizedEvaluationFeedback?: string;
        personalizedEvaluationSuggestion?: string;
        personalizedIsComplete?: boolean;
        sampleResponse?: string;
        visitedStages?: string[];
    }): Promise<{
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
    getPersonalizedContent(userId: string, lessonId: number, locale: 'en' | 'vi'): Promise<{
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
    savePersonalizedContent(userId: string, lessonId: number, locale: 'en' | 'vi', content: {
        realWorldScenario: string;
        personalizedExercise: string;
        applicationGuide: string;
        fullPrompt: string;
        components: any;
    }): Promise<{
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
    getCompletionStats(userId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        completionPercentage: number;
    }>;
}
