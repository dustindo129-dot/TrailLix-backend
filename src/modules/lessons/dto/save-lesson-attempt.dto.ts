import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveLessonAttemptDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  simplePrompt?: string;

  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  simpleEvaluationScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  simpleEvaluationFeedback?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  simpleEvaluationSuggestion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  simpleIsComplete?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalizedPrompt?: string;

  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  personalizedEvaluationScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalizedEvaluationFeedback?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalizedEvaluationSuggestion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  personalizedIsComplete?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sampleResponse?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  visitedStages?: string[];
}

