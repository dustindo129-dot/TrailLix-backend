import { IsInt, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AwardXpDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Unique event key to prevent XP farming' })
  @IsString()
  eventKey: string;
}

