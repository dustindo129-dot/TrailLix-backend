import { GeminiService } from '../../services/gemini.service';
import { LessonsService } from '../lessons/lessons.service';
import type { UserProfile, Evaluation, PersonalizedLessonContent } from '../../data/types';
export declare class AiPersonalizationService {
    private geminiService;
    private lessonsService;
    constructor(geminiService: GeminiService, lessonsService: LessonsService);
    evaluatePrompt(userPrompt: string, lessonId: number, exerciseContext: string, locale: 'en' | 'vi'): Promise<Evaluation>;
    getSampleResponse(userPrompt: string, locale: 'en' | 'vi'): Promise<string>;
    generatePersonalizedLesson(lessonId: number, userProfile: UserProfile, locale: 'en' | 'vi'): Promise<PersonalizedLessonContent>;
    analyzeImage(prompt: string, base64ImageData: string, mimeType: string): Promise<string>;
    createChat(): import("@google/genai").Chat;
}
