import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('check-access/:lessonOrderIndex')
  @ApiOperation({ summary: 'Check if user has access to a lesson' })
  async checkLessonAccess(
    @Request() req,
    @Param('lessonOrderIndex', ParseIntPipe) lessonOrderIndex: number,
  ) {
    return this.subscriptionsService.checkLessonAccess(req.user.userId, lessonOrderIndex);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user subscription info' })
  async getMySubscription(@Request() req) {
    return this.subscriptionsService.getUserSubscription(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user subscription history' })
  async getMyHistory(@Request() req) {
    return this.subscriptionsService.getUserSubscriptionHistory(req.user.userId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new subscription (after payment)' })
  async createSubscription(@Request() req, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(req.user.userId, dto);
  }

  @Post('cancel/:subscriptionId')
  @ApiOperation({ summary: 'Cancel a subscription' })
  async cancelSubscription(@Request() req, @Param('subscriptionId') subscriptionId: string) {
    return this.subscriptionsService.cancelSubscription(req.user.userId, subscriptionId);
  }

  @Get('admin/all')
  @ApiOperation({ summary: 'Admin: Get all subscriptions' })
  async getAllSubscriptions(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    // TODO: Add admin guard
    return this.subscriptionsService.getAllSubscriptions(page, limit);
  }
}

