declare const _default: () => {
    port: number;
    apiPrefix: string;
    nodeEnv: string;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        s3Bucket: string;
    };
    email: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
    cors: {
        origin: string[];
    };
    rateLimit: {
        ttl: number;
        limit: number;
    };
    vnPayment: {
        bankName: string;
        bankAccount: string;
        bankAccountName: string;
        qrTimeout: number;
    };
    gemini: {
        apiKey: string;
    };
    features: {
        swagger: boolean;
        rateLimiting: boolean;
        cors: boolean;
    };
};
export default _default;
