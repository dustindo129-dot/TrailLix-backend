import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  base64ImageData: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}

