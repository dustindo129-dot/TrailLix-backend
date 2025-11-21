import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AwardXpDto } from './dto';

@ApiTags('gamification')
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('award-xp')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Award XP to the authenticated user' })
  async awardXp(@Body() dto: AwardXpDto, @Req() req: any) {
    return this.gamificationService.awardXp(req.user.id || req.user.userId, dto.amount, dto.eventKey);
  }

  @Post('update-streak')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user login streak' })
  async updateStreak(@Req() req: any) {
    return this.gamificationService.updateStreak(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user gamification statistics' })
  @ApiQuery({ name: 'locale', enum: ['en', 'vi'], required: false })
  async getStats(@Query('locale') locale: 'en' | 'vi', @Req() req: any) {
    return this.gamificationService.getStats(req.user.id, locale || 'en');
  }

  @Post('certificate/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Generate certificate for user' })
  @ApiQuery({ name: 'locale', enum: ['en', 'vi'], required: false })
  async generateCertificate(@Query('locale') locale: 'en' | 'vi', @Req() req: any) {
    return this.gamificationService.generateCertificate(req.user.id, locale || 'en');
  }

  @Get('certificate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user certificate' })
  async getCertificate(@Req() req: any) {
    return this.gamificationService.getCertificate(req.user.id);
  }

  @Get('certificate/verify/:certificateNumber')
  @ApiOperation({ summary: 'Verify a certificate by certificate number' })
  async verifyCertificate(@Param('certificateNumber') certificateNumber: string) {
    return this.gamificationService.verifyCertificate(certificateNumber);
  }
}

