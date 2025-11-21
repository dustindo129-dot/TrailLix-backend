import { ConfigService } from '@nestjs/config';
import { Chat } from '@google/genai';
import type { Lesson, Evaluation, PersonalizedLessonContent, UserProfile } from '../data/types';
export declare class GeminiService {
    private configService;
    private readonly logger;
    private ai;
    constructor(configService: ConfigService);
    private readonly evaluationSchema;
    private readonly personalizedLessonSchema;
    private getSystemInstruction;
    evaluatePrompt(userPrompt: string, lesson: Lesson, exerciseContext: string, locale: 'en' | 'vi'): Promise<Evaluation>;
    getSampleResponse(userPrompt: string, locale: 'en' | 'vi'): Promise<string>;
    generatePersonalizedLesson(lesson: Lesson, userProfile: UserProfile, locale: 'en' | 'vi'): Promise<PersonalizedLessonContent>;
    createChat(): Chat;
    analyzeImage(prompt: string, base64ImageData: string, mimeType: string): Promise<string>;
}
