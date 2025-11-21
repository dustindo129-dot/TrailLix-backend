"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPersonalizationModule = void 0;
const common_1 = require("@nestjs/common");
const ai_personalization_controller_1 = require("./ai-personalization.controller");
const ai_personalization_service_1 = require("./ai-personalization.service");
const gemini_service_1 = require("../../services/gemini.service");
const lessons_module_1 = require("../lessons/lessons.module");
let AiPersonalizationModule = class AiPersonalizationModule {
};
exports.AiPersonalizationModule = AiPersonalizationModule;
exports.AiPersonalizationModule = AiPersonalizationModule = __decorate([
    (0, common_1.Module)({
        imports: [lessons_module_1.LessonsModule],
        controllers: [ai_personalization_controller_1.AiPersonalizationController],
        providers: [ai_personalization_service_1.AiPersonalizationService, gemini_service_1.GeminiService],
        exports: [ai_personalization_service_1.AiPersonalizationService],
    })
], AiPersonalizationModule);
//# sourceMappingURL=ai-personalization.module.js.map