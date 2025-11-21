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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPersonalizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_personalization_service_1 = require("./ai-personalization.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("./dto");
let AiPersonalizationController = class AiPersonalizationController {
    constructor(aiPersonalizationService) {
        this.aiPersonalizationService = aiPersonalizationService;
    }
    async evaluatePrompt(dto) {
        return this.aiPersonalizationService.evaluatePrompt(dto.userPrompt, dto.lessonId, dto.exerciseContext, dto.locale);
    }
    async getSampleResponse(dto) {
        const response = await this.aiPersonalizationService.getSampleResponse(dto.userPrompt, dto.locale);
        return { response };
    }
    async generatePersonalizedLesson(dto) {
        return this.aiPersonalizationService.generatePersonalizedLesson(dto.lessonId, dto.userProfile, dto.locale);
    }
    async analyzeImage(dto) {
        const response = await this.aiPersonalizationService.analyzeImage(dto.prompt, dto.base64ImageData, dto.mimeType);
        return { response };
    }
};
exports.AiPersonalizationController = AiPersonalizationController;
__decorate([
    (0, common_1.Post)('evaluate-prompt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate a user prompt using AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EvaluatePromptDto]),
    __metadata("design:returntype", Promise)
], AiPersonalizationController.prototype, "evaluatePrompt", null);
__decorate([
    (0, common_1.Post)('sample-response'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a sample response from AI for a user prompt' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetSampleResponseDto]),
    __metadata("design:returntype", Promise)
], AiPersonalizationController.prototype, "getSampleResponse", null);
__decorate([
    (0, common_1.Post)('generate-personalized-lesson'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate personalized lesson content for a user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GeneratePersonalizedLessonDto]),
    __metadata("design:returntype", Promise)
], AiPersonalizationController.prototype, "generatePersonalizedLesson", null);
__decorate([
    (0, common_1.Post)('analyze-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze an image using AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AnalyzeImageDto]),
    __metadata("design:returntype", Promise)
], AiPersonalizationController.prototype, "analyzeImage", null);
exports.AiPersonalizationController = AiPersonalizationController = __decorate([
    (0, swagger_1.ApiTags)('ai-personalization'),
    (0, common_1.Controller)('ai-personalization'),
    __metadata("design:paramtypes", [ai_personalization_service_1.AiPersonalizationService])
], AiPersonalizationController);
//# sourceMappingURL=ai-personalization.controller.js.map