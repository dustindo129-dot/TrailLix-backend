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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gamification_service_1 = require("./gamification.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const dto_1 = require("./dto");
let GamificationController = class GamificationController {
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async awardXp(dto, req) {
        return this.gamificationService.awardXp(req.user.id || req.user.userId, dto.amount, dto.eventKey);
    }
    async updateStreak(req) {
        return this.gamificationService.updateStreak(req.user.id);
    }
    async getStats(locale, req) {
        return this.gamificationService.getStats(req.user.id, locale || 'en');
    }
    async generateCertificate(locale, req) {
        return this.gamificationService.generateCertificate(req.user.id, locale || 'en');
    }
    async getCertificate(req) {
        return this.gamificationService.getCertificate(req.user.id);
    }
    async verifyCertificate(certificateNumber) {
        return this.gamificationService.verifyCertificate(certificateNumber);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Post)('award-xp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Award XP to the authenticated user' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AwardXpDto, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "awardXp", null);
__decorate([
    (0, common_1.Post)('update-streak'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user login streak' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "updateStreak", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user gamification statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'locale', enum: ['en', 'vi'], required: false }),
    __param(0, (0, common_1.Query)('locale')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('certificate/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate certificate for user' }),
    (0, swagger_1.ApiQuery)({ name: 'locale', enum: ['en', 'vi'], required: false }),
    __param(0, (0, common_1.Query)('locale')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "generateCertificate", null);
__decorate([
    (0, common_1.Get)('certificate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user certificate' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getCertificate", null);
__decorate([
    (0, common_1.Get)('certificate/verify/:certificateNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a certificate by certificate number' }),
    __param(0, (0, common_1.Param)('certificateNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "verifyCertificate", null);
exports.GamificationController = GamificationController = __decorate([
    (0, swagger_1.ApiTags)('gamification'),
    (0, common_1.Controller)('gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map