"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const ai_personalization_module_1 = require("./modules/ai-personalization/ai-personalization.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const upload_module_1 = require("./modules/upload/upload.module");
const email_module_1 = require("./modules/email/email.module");
const audit_module_1 = require("./modules/audit/audit.module");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: () => ({
                    throttlers: [
                        {
                            name: 'short',
                            ttl: 1000,
                            limit: 3,
                        },
                        {
                            name: 'medium',
                            ttl: 10000,
                            limit: 20,
                        },
                        {
                            name: 'long',
                            ttl: 60000,
                            limit: 100,
                        },
                    ],
                }),
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: () => ({
                    store: 'redis',
                    socket: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT) || 6379,
                    },
                    ttl: 300,
                }),
            }),
            bullmq_1.BullModule.forRootAsync({
                useFactory: () => ({
                    connection: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT) || 6379,
                    },
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            lessons_module_1.LessonsModule,
            ai_personalization_module_1.AiPersonalizationModule,
            gamification_module_1.GamificationModule,
            subscriptions_module_1.SubscriptionsModule,
            upload_module_1.UploadModule,
            email_module_1.EmailModule,
            audit_module_1.AuditModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map