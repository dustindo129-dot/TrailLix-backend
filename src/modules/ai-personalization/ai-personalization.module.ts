import { Module } from '@nestjs/common';
import { AiPersonalizationController } from './ai-personalization.controller';
import { AiPersonalizationService } from './ai-personalization.service';
import { GeminiService } from '../../services/gemini.service';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [LessonsModule],
  controllers: [AiPersonalizationController],
  providers: [AiPersonalizationService, GeminiService],
  exports: [AiPersonalizationService],
})
export class AiPersonalizationModule {}

