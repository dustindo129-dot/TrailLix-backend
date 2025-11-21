import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../services/gemini.service';
import { LessonsService } from '../lessons/lessons.service';
import type { UserProfile, Evaluation, PersonalizedLessonContent } from '../../data/types';

@Injectable()
export class AiPersonalizationService {
  constructor(
    private geminiService: GeminiService,
    private lessonsService: LessonsService,
  ) {}

  async evaluatePrompt(
    userPrompt: string,
    lessonId: number,
    exerciseContext: string,
    locale: 'en' | 'vi',
  ): Promise<Evaluation> {
    const lesson = await this.lessonsService.findOne(lessonId);
    return this.geminiService.evaluatePrompt(userPrompt, lesson, exerciseContext, locale);
  }

  async getSampleResponse(userPrompt: string, locale: 'en' | 'vi'): Promise<string> {
    return this.geminiService.getSampleResponse(userPrompt, locale);
  }

  async generatePersonalizedLesson(
    lessonId: number,
    userProfile: UserProfile,
    locale: 'en' | 'vi',
  ): Promise<PersonalizedLessonContent> {
    const lesson = await this.lessonsService.findOne(lessonId);
    return this.geminiService.generatePersonalizedLesson(lesson, userProfile, locale);
  }

  async analyzeImage(prompt: string, base64ImageData: string, mimeType: string): Promise<string> {
    return this.geminiService.analyzeImage(prompt, base64ImageData, mimeType);
  }

  createChat() {
    return this.geminiService.createChat();
  }
}

