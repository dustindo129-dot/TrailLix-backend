export type { Chat } from '@google/genai';

export interface PromptComponent {
  labelKey: string;
  text: string;
}

export interface LessonContent {
  title: string;
  category: string;
  what: string; // Explanation of the technique
  why: string; // Why it's necessary
  formula: string; // How to apply it
  comparison: { // Comparison between normal and applied prompt
    before: string;
    after: string;
  };
  simpleExample: { // Simple example for practice
    context: string;
    fullPrompt: string;
    components: PromptComponent[];
  };
}

export interface Lesson {
  id: number;
  // FIX: Added optional level property to Lesson interface.
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
    date: string; // Completion date
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
    // Storing both allows resuming the lesson at the correct stage
    simplePrompt?: string;
    simpleEvaluation?: Evaluation;
    personalizedPrompt?: string;
    personalizedEvaluation?: Evaluation;
    sampleResponse?: string | null; // From personalized prompt
    visitedStages?: string[]; // To track XP for stage progression
}

export interface User {
    username: string;
    email: string;
    password?: string;
    profile: UserProfile | null;
    progress: Set<number>;
    certificate: CertificateData | null;
    personalizedContent?: { [lessonId: number]: { [locale: string]: PersonalizedLessonContent } };
    lessonAttempts?: { [lessonId: number]: LessonAttempt };
    hasSeenEvaluationOnboarding?: boolean;
    hasSeenConceptsIntro?: boolean;
    courseStartDate?: string;
    // Gamification fields
    xp: number;
    level: number;
    streak: number;
    longestStreak?: number;
    lastLogin: string; // YYYY-MM-DD
}