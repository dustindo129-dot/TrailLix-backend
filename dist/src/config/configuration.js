"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'ap-southeast-1',
        s3Bucket: process.env.AWS_S3_BUCKET || 'traillix-storage',
    },
    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.FROM_EMAIL || 'noreply@traillix.com',
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['*'],
    },
    rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
        limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
    },
    vnPayment: {
        bankName: process.env.VN_BANK_NAME || 'Vietcombank',
        bankAccount: process.env.VN_BANK_ACCOUNT,
        bankAccountName: process.env.VN_BANK_ACCOUNT_NAME,
        qrTimeout: parseInt(process.env.QR_PAYMENT_TIMEOUT, 10) || 15,
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY,
    },
    features: {
        swagger: process.env.ENABLE_SWAGGER === 'true',
        rateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
        cors: process.env.ENABLE_CORS !== 'false',
    },
});
//# sourceMappingURL=configuration.js.map