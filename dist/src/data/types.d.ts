export type { Chat } from '@google/genai';
export interface PromptComponent {
    labelKey: string;
    text: string;
}
export interface LessonContent {
    title: string;
    category: string;
    what: string;
    why: string;
    formula: string;
    comparison: {
        before: string;
        after: string;
    };
    simpleExample: {
        context: string;
        fullPrompt: string;
        components: PromptComponent[];
    };
}
export interface Lesson {
    id: number;
    level?: number;
    content: {
        en: LessonContent;
        vi: LessonContent;
    };
}
export interface Evaluation {
    score: number;
    feedback: string;
    suggestion: string;
    isComplete: boolean;
}
export interface DisplayMessage {
    role: 'user' | 'model';
    text: string;
}
export interface PersonalizedLessonContent {
    realWorldScenario: string;
    personalizedExercise: string;
    applicationGuide: string;
    fullPrompt: string;
    components: PromptComponent[];
}
export interface CertificateData {
    id: string;
    name: string;
    date: string;
    startDate?: string;
    checkpoints?: number;
    totalCheckpoints?: number;
    rank?: string;
    totalXp?: number;
    longestStreak?: number;
}
export interface UserProfile {
    name: string;
    ageRange: string;
    role: string;
    aiExperience: string;
    skills: string[];
    achievement: string;
    fields: string[];
    motivations: string[];
}
export interface LessonAttempt {
    simplePrompt?: string;
    simpleEvaluation?: Evaluation;
    personalizedPrompt?: string;
    personalizedEvaluation?: Evaluation;
    sampleResponse?: string | null;
    visitedStages?: string[];
}
export interface User {
    username: string;
    email: string;
    password?: string;
    profile: UserProfile | null;
    progress: Set<number>;
    certificate: CertificateData | null;
    personalizedContent?: {
        [lessonId: number]: {
            [locale: string]: PersonalizedLessonContent;
        };
    };
    lessonAttempts?: {
        [lessonId: number]: LessonAttempt;
    };
    hasSeenEvaluationOnboarding?: boolean;
    hasSeenConceptsIntro?: boolean;
    courseStartDate?: string;
    xp: number;
    level: number;
    streak: number;
    longestStreak?: number;
    lastLogin: string;
}
