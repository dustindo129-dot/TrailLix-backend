import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSampleResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @ApiProperty({ enum: ['en', 'vi'] })
  @IsString()
  @IsIn(['en', 'vi'])
  locale: 'en' | 'vi';
}

