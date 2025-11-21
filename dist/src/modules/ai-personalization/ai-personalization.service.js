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
exports.AiPersonalizationService = void 0;
const common_1 = require("@nestjs/common");
const gemini_service_1 = require("../../services/gemini.service");
const lessons_service_1 = require("../lessons/lessons.service");
let AiPersonalizationService = class AiPersonalizationService {
    constructor(geminiService, lessonsService) {
        this.geminiService = geminiService;
        this.lessonsService = lessonsService;
    }
    async evaluatePrompt(userPrompt, lessonId, exerciseContext, locale) {
        const lesson = await this.lessonsService.findOne(lessonId);
        return this.geminiService.evaluatePrompt(userPrompt, lesson, exerciseContext, locale);
    }
    async getSampleResponse(userPrompt, locale) {
        return this.geminiService.getSampleResponse(userPrompt, locale);
    }
    async generatePersonalizedLesson(lessonId, userProfile, locale) {
        const lesson = await this.lessonsService.findOne(lessonId);
        return this.geminiService.generatePersonalizedLesson(lesson, userProfile, locale);
    }
    async analyzeImage(prompt, base64ImageData, mimeType) {
        return this.geminiService.analyzeImage(prompt, base64ImageData, mimeType);
    }
    createChat() {
        return this.geminiService.createChat();
    }
};
exports.AiPersonalizationService = AiPersonalizationService;
exports.AiPersonalizationService = AiPersonalizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService,
        lessons_service_1.LessonsService])
], AiPersonalizationService);
//# sourceMappingURL=ai-personalization.service.js.map