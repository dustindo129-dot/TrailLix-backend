import { AiPersonalizationService } from './ai-personalization.service';
import { EvaluatePromptDto, GeneratePersonalizedLessonDto, GetSampleResponseDto, AnalyzeImageDto } from './dto';
export declare class AiPersonalizationController {
    private readonly aiPersonalizationService;
    constructor(aiPersonalizationService: AiPersonalizationService);
    evaluatePrompt(dto: EvaluatePromptDto): Promise<import("../../data/types").Evaluation>;
    getSampleResponse(dto: GetSampleResponseDto): Promise<{
        response: string;
    }>;
    generatePersonalizedLesson(dto: GeneratePersonalizedLessonDto): Promise<import("../../data/types").PersonalizedLessonContent>;
    analyzeImage(dto: AnalyzeImageDto): Promise<{
        response: string;
    }>;
}
