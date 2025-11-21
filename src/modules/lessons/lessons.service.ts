import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { lessons } from '../../data/lessons';
import type { Lesson } from '../../data/types';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  // Get all lessons (static content from lessons.ts)
  async findAll(): Promise<Lesson[]> {
    return lessons.filter(lesson => lesson.id !== 0); // Exclude the welcome lesson if id=0
  }

  // Get a specific lesson by ID
  async findOne(id: number): Promise<Lesson> {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  // Get user's progress for a specific lesson
  async getUserProgress(userId: string, lessonId: number) {
    return await this.prisma.lessonProgress.findUnique({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: lessonId,
        },
      },
    });
  }

  // Get all user's progress
  async getUserAllProgress(userId: string) {
    return await this.prisma.lessonProgress.findMany({
      where: { user_id: userId },
      include: {
        lesson: true,
      },
    });
  }

  // Mark a lesson as completed
  async markLessonComplete(userId: string, lessonId: number) {
    const lesson = await this.findOne(lessonId);
    
    // Mark lesson as completed in progress table
    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: lessonId,
        },
      },
      update: {
        completed: true,
        completed_at: new Date(),
      },
      create: {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date(),
      },
    });

    // Track free lessons used if user doesn't have active subscription
    await this.subscriptionsService.markLessonCompleted(userId, lessonId);

    return progress;
  }

  // Get lesson attempt for a user
  async getLessonAttempt(userId: string, lessonId: number) {
    return await this.prisma.lessonAttempt.findUnique({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: lessonId,
        },
      },
    });
  }

  // Save/update lesson attempt
  async saveLessonAttempt(
    userId: string,
    lessonId: number,
    attemptData: {
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
    },
  ) {
    const lesson = await this.findOne(lessonId);

    // Map camelCase to snake_case for Prisma
    const prismaData: any = {};
    if (attemptData.simplePrompt !== undefined) prismaData.simple_prompt = attemptData.simplePrompt;
    if (attemptData.simpleEvaluationScore !== undefined) prismaData.simple_evaluation_score = attemptData.simpleEvaluationScore;
    if (attemptData.simpleEvaluationFeedback !== undefined) prismaData.simple_evaluation_feedback = attemptData.simpleEvaluationFeedback;
    if (attemptData.simpleEvaluationSuggestion !== undefined) prismaData.simple_evaluation_suggestion = attemptData.simpleEvaluationSuggestion;
    if (attemptData.simpleIsComplete !== undefined) prismaData.simple_is_complete = attemptData.simpleIsComplete;
    if (attemptData.personalizedPrompt !== undefined) prismaData.personalized_prompt = attemptData.personalizedPrompt;
    if (attemptData.personalizedEvaluationScore !== undefined) prismaData.personalized_evaluation_score = attemptData.personalizedEvaluationScore;
    if (attemptData.personalizedEvaluationFeedback !== undefined) prismaData.personalized_evaluation_feedback = attemptData.personalizedEvaluationFeedback;
    if (attemptData.personalizedEvaluationSuggestion !== undefined) prismaData.personalized_evaluation_suggestion = attemptData.personalizedEvaluationSuggestion;
    if (attemptData.personalizedIsComplete !== undefined) prismaData.personalized_is_complete = attemptData.personalizedIsComplete;
    if (attemptData.sampleResponse !== undefined) prismaData.sample_response = attemptData.sampleResponse;
    if (attemptData.visitedStages !== undefined) prismaData.visited_stages = attemptData.visitedStages;

    return await this.prisma.lessonAttempt.upsert({
      where: {
        user_id_lesson_id: {
          user_id: userId,
          lesson_id: lessonId,
        },
      },
      update: prismaData,
      create: {
        user_id: userId,
        lesson_id: lessonId,
        ...prismaData,
      },
    });
  }

  // Get personalized content
  async getPersonalizedContent(userId: string, lessonId: number, locale: 'en' | 'vi') {
    return await this.prisma.personalizedLessonContent.findUnique({
      where: {
        user_id_lesson_id_locale: {
          user_id: userId,
          lesson_id: lessonId,
          locale: locale,
        },
      },
    });
  }

  // Save personalized content
  async savePersonalizedContent(
    userId: string,
    lessonId: number,
    locale: 'en' | 'vi',
    content: {
      realWorldScenario: string;
      personalizedExercise: string;
      applicationGuide: string;
      fullPrompt: string;
      components: any;
    },
  ) {
    const lesson = await this.findOne(lessonId);

    // Map camelCase to snake_case for Prisma
    const prismaData = {
      real_world_scenario: content.realWorldScenario,
      personalized_exercise: content.personalizedExercise,
      application_guide: content.applicationGuide,
      full_prompt: content.fullPrompt,
      components: content.components,
    };

    return await this.prisma.personalizedLessonContent.upsert({
      where: {
        user_id_lesson_id_locale: {
          user_id: userId,
          lesson_id: lessonId,
          locale: locale,
        },
      },
      update: prismaData,
      create: {
        user: { connect: { id: userId } },
        lesson: { connect: { id: lessonId } },
        locale: locale,
        ...prismaData,
      },
    });
  }

  // Get lesson completion stats
  async getCompletionStats(userId: string) {
    const totalLessons = lessons.filter(l => l.id !== 0).length;
    const completedCount = await this.prisma.lessonProgress.count({
      where: {
        user_id: userId,
        completed: true,
      },
    });

    return {
      totalLessons,
      completedLessons: completedCount,
      completionPercentage: Math.round((completedCount / totalLessons) * 100),
    };
  }
}
