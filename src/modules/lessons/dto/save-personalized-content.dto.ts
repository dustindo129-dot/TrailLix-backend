import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PromptComponentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  labelKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class SavePersonalizedContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  realWorldScenario: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  personalizedExercise: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationGuide: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullPrompt: string;

  @ApiProperty({ type: [PromptComponentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromptComponentDto)
  components: PromptComponentDto[];
}

