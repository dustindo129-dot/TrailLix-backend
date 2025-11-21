import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'monthly', description: 'Subscription plan type' })
  @IsString()
  plan_type: string;

  @ApiProperty({ example: 99000, description: 'Amount in VND' })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: Currency, default: Currency.VND })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty({ example: 'qr_code', required: false })
  @IsString()
  @IsOptional()
  payment_method?: string;

  @ApiProperty({ example: 'TXN123456789', required: false })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ example: '2025-12-14T00:00:00Z', description: 'When subscription ends' })
  @IsString()
  end_date: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  auto_renew?: boolean;
}

