import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  course_id: string;

  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  order_index: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration_s?: number = 0;

  @IsString()
  @IsOptional()
  video_asset_id?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  is_free_preview?: boolean = false;
}
