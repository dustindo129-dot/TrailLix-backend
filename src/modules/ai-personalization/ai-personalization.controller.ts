import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiPersonalizationService } from './ai-personalization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  EvaluatePromptDto,
  GeneratePersonalizedLessonDto,
  GetSampleResponseDto,
  AnalyzeImageDto,
} from './dto';

@ApiTags('ai-personalization')
@Controller('ai-personalization')
export class AiPersonalizationController {
  constructor(private readonly aiPersonalizationService: AiPersonalizationService) {}

  @Post('evaluate-prompt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Evaluate a user prompt using AI' })
  async evaluatePrompt(@Body() dto: EvaluatePromptDto) {
    return this.aiPersonalizationService.evaluatePrompt(
      dto.userPrompt,
      dto.lessonId,
      dto.exerciseContext,
      dto.locale,
    );
  }

  @Post('sample-response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a sample response from AI for a user prompt' })
  async getSampleResponse(@Body() dto: GetSampleResponseDto) {
    const response = await this.aiPersonalizationService.getSampleResponse(dto.userPrompt, dto.locale);
    return { response };
  }

  @Post('generate-personalized-lesson')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generate personalized lesson content for a user' })
  async generatePersonalizedLesson(@Body() dto: GeneratePersonalizedLessonDto) {
    return this.aiPersonalizationService.generatePersonalizedLesson(
      dto.lessonId,
      dto.userProfile,
      dto.locale,
    );
  }

  @Post('analyze-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Analyze an image using AI' })
  async analyzeImage(@Body() dto: AnalyzeImageDto) {
    const response = await this.aiPersonalizationService.analyzeImage(
      dto.prompt,
      dto.base64ImageData,
      dto.mimeType,
    );
    return { response };
  }
}

