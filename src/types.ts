// Types for TRAILIX AI Prompt Engineering Education Platform

export interface Lesson {
  id: number;
  content: {
    en: LessonContent;
    vi: LessonContent;
  };
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
  personalizedExample?: {
    realWorldScenario: string;
    personalizedExercise: string;
    applicationGuide: string;
    fullPrompt: string;
    components: PromptComponent[];
  };
}

export interface PromptComponent {
  labelKey: string;
  text: string;
}

export interface Evaluation {
  score: number;
  feedback: string;
  suggestion: string;
}

export interface UserProfile {
  ageRange: string;
  roleDescription: string;
  aiExperience: string;
  skills: string[];
  achievement: string;
  fields: string[];
  motivations: string[];
}

export interface PersonalizedLessonContent {
  realWorldScenario: string;
  personalizedExercise: string;
  applicationGuide: string;
  fullPrompt: string;
  components: PromptComponent[];
}

export interface CertificateData {
  certificateNumber: string;
  name: string;
  startDate: string;
  completionDate: string;
  checkpoints: number;
  totalCheckpoints: number;
  rank: string;
  totalXP: number;
  longestStreak: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  // Profile fields
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
}

