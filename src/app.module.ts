import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AiPersonalizationModule } from './modules/ai-personalization/ai-personalization.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
// import { OrdersModule } from './modules/orders/orders.module';
// import { PaymentsModule } from './modules/payments/payments.module';
import { UploadModule } from './modules/upload/upload.module';
import { EmailModule } from './modules/email/email.module';
import { AuditModule } from './modules/audit/audit.module';

import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            name: 'short',
            ttl: 1000, // 1 second
            limit: 3,
          },
          {
            name: 'medium',
            ttl: 10000, // 10 seconds
            limit: 20,
          },
          {
            name: 'long',
            ttl: 60000, // 1 minute
            limit: 100,
          },
        ],
      }),
    }),

    // Redis cache
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: 'redis',
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
        ttl: 300, // 5 minutes default TTL
      }),
    }),

    // BullMQ for job queues
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }),
    }),

    // Core modules
    PrismaModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    LessonsModule,
    AiPersonalizationModule,
    GamificationModule,
    SubscriptionsModule,
    // OrdersModule,  // Kept for future use
    // PaymentsModule,  // Kept for future use
    UploadModule,
    EmailModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
