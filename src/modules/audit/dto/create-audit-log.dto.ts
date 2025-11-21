import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  actor_user_id: string;

  @IsString()
  action: string;

  @IsString()
  entity: string;

  @IsString()
  entity_id: string;

  @IsObject()
  @IsOptional()
  diff_json?: any;

  @IsString()
  @IsOptional()
  ip_address?: string;

  @IsString()
  @IsOptional()
  user_agent?: string;
}
