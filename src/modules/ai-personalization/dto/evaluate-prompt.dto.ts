import { IsString, IsNotEmpty, IsInt, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluatePromptDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @ApiProperty()
  @IsInt()
  lessonId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  exerciseContext: string;

  @ApiProperty({ enum: ['en', 'vi'] })
  @IsString()
  @IsIn(['en', 'vi'])
  locale: 'en' | 'vi';
}

