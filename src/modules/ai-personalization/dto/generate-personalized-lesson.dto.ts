import { IsString, IsNotEmpty, IsInt, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ageRange: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  aiExperience: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  achievement: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  fields: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  motivations: string[];
}

export class GeneratePersonalizedLessonDto {
  @ApiProperty()
  @IsInt()
  lessonId: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto;

  @ApiProperty({ enum: ['en', 'vi'] })
  @IsString()
  @IsIn(['en', 'vi'])
  locale: 'en' | 'vi';
}

