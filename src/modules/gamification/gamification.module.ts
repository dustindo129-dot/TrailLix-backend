import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [PrismaModule, LessonsModule],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}

