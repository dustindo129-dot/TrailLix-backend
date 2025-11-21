"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = configService.get('PORT', 3000);
    const apiPrefix = configService.get('API_PREFIX', 'api');
    const corsOrigin = configService.get('CORS_ORIGIN', '*').split(',');
    const nodeEnv = configService.get('NODE_ENV', 'development');
    app.setGlobalPrefix(apiPrefix);
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
                scriptSrc: [`'self'`],
                manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
                frameSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
            },
        },
    }));
    app.use(compression());
    app.use(cookieParser());
    app.enableCors({
        origin: corsOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    if (nodeEnv === 'development' && configService.get('ENABLE_SWAGGER', true)) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('TrailLix API')
            .setDescription('AI Course Platform API Documentation')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        logger.log(`📚 Swagger documentation available at http://localhost:${port}/${apiPrefix}/docs`);
    }
    await app.listen(port);
    logger.log(`🚀 TrailLix API is running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
}
bootstrap();
//# sourceMappingURL=main.js.map