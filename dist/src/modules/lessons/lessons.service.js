"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
const lessons_1 = require("../../data/lessons");
let LessonsService = class LessonsService {
    constructor(prisma, subscriptionsService) {
        this.prisma = prisma;
        this.subscriptionsService = subscriptionsService;
    }
    async findAll() {
        return lessons_1.lessons.filter(lesson => lesson.id !== 0);
    }
    async findOne(id) {
        const lesson = lessons_1.lessons.find(l => l.id === id);
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async getUserProgress(userId, lessonId) {
        return await this.prisma.lessonProgress.findUnique({
            where: {
                user_id_lesson_id: {
                    user_id: userId,
                    lesson_id: lessonId,
                },
            },
        });
    }
    async getUserAllProgress(userId) {
        return await this.prisma.lessonProgress.findMany({
            where: { user_id: userId },
            include: {
                lesson: true,
            },
        });
    }
    async markLessonComplete(userId, lessonId) {
        const lesson = await this.findOne(lessonId);
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
        await this.subscriptionsService.markLessonCompleted(userId, lessonId);
        return progress;
    }
    async getLessonAttempt(userId, lessonId) {
        return await this.prisma.lessonAttempt.findUnique({
            where: {
                user_id_lesson_id: {
                    user_id: userId,
                    lesson_id: lessonId,
                },
            },
        });
    }
    async saveLessonAttempt(userId, lessonId, attemptData) {
        const lesson = await this.findOne(lessonId);
        const prismaData = {};
        if (attemptData.simplePrompt !== undefined)
            prismaData.simple_prompt = attemptData.simplePrompt;
        if (attemptData.simpleEvaluationScore !== undefined)
            prismaData.simple_evaluation_score = attemptData.simpleEvaluationScore;
        if (attemptData.simpleEvaluationFeedback !== undefined)
            prismaData.simple_evaluation_feedback = attemptData.simpleEvaluationFeedback;
        if (attemptData.simpleEvaluationSuggestion !== undefined)
            prismaData.simple_evaluation_suggestion = attemptData.simpleEvaluationSuggestion;
        if (attemptData.simpleIsComplete !== undefined)
            prismaData.simple_is_complete = attemptData.simpleIsComplete;
        if (attemptData.personalizedPrompt !== undefined)
            prismaData.personalized_prompt = attemptData.personalizedPrompt;
        if (attemptData.personalizedEvaluationScore !== undefined)
            prismaData.personalized_evaluation_score = attemptData.personalizedEvaluationScore;
        if (attemptData.personalizedEvaluationFeedback !== undefined)
            prismaData.personalized_evaluation_feedback = attemptData.personalizedEvaluationFeedback;
        if (attemptData.personalizedEvaluationSuggestion !== undefined)
            prismaData.personalized_evaluation_suggestion = attemptData.personalizedEvaluationSuggestion;
        if (attemptData.personalizedIsComplete !== undefined)
            prismaData.personalized_is_complete = attemptData.personalizedIsComplete;
        if (attemptData.sampleResponse !== undefined)
            prismaData.sample_response = attemptData.sampleResponse;
        if (attemptData.visitedStages !== undefined)
            prismaData.visited_stages = attemptData.visitedStages;
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
    async getPersonalizedContent(userId, lessonId, locale) {
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
    async savePersonalizedContent(userId, lessonId, locale, content) {
        const lesson = await this.findOne(lessonId);
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
    async getCompletionStats(userId) {
        const totalLessons = lessons_1.lessons.filter(l => l.id !== 0).length;
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
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        subscriptions_service_1.SubscriptionsService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map