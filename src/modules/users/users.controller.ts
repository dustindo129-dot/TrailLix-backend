import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id || req.user.userId);
    const { password_hash, ...profile } = user;
    return { data: profile };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req,
    @Body() updateData: {
      name?: string;
      avatar_url?: string;
      age_range?: string;
      role_description?: string;
      ai_experience?: string;
      skills?: string[];
      achievement?: string;
      fields?: string[];
      motivations?: string[];
      course_start_date?: string;
      has_seen_concepts_intro?: boolean;
    }
  ) {
    const user = await this.usersService.updateProfile(req.user.id || req.user.userId, updateData);
    const { password_hash, ...profile } = user;
    return { data: profile };
  }
}
