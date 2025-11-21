import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveLessonAttemptDto, SavePersonalizedContentDto } from './dto';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons' })
  async findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific lesson by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Get(':id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user progress for a specific lesson' })
  async getProgress(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.lessonsService.getUserProgress(req.user.id, id);
  }

  @Get('user/all-progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all user progress' })
  async getAllProgress(@Req() req: any) {
    return this.lessonsService.getUserAllProgress(req.user.id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark a lesson as completed' })
  async markComplete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.lessonsService.markLessonComplete(req.user.id, id);
  }

  @Get(':id/attempt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get lesson attempt for a user' })
  async getAttempt(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.lessonsService.getLessonAttempt(req.user.id, id);
  }

  @Post(':id/attempt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save/update lesson attempt' })
  async saveAttempt(
    @Param('id', ParseIntPipe) id: number,
    @Body() attemptData: SaveLessonAttemptDto,
    @Req() req: any,
  ) {
    return this.lessonsService.saveLessonAttempt(req.user.id, id, attemptData);
  }

  @Get(':id/personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get personalized lesson content' })
  async getPersonalizedContent(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') locale: 'en' | 'vi',
    @Req() req: any,
  ) {
    return this.lessonsService.getPersonalizedContent(req.user.id, id, locale || 'en');
  }

  @Post(':id/personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save personalized lesson content' })
  async savePersonalizedContent(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') locale: 'en' | 'vi',
    @Body() content: SavePersonalizedContentDto,
    @Req() req: any,
  ) {
    return this.lessonsService.savePersonalizedContent(req.user.id, id, locale || 'en', content);
  }

  @Get('user/completion-stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get lesson completion statistics' })
  async getCompletionStats(@Req() req: any) {
    return this.lessonsService.getCompletionStats(req.user.id);
  }
}
