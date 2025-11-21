import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    cleanDatabase(): Promise<void>;
    softDelete(model: string, id: string): Promise<any>;
    executeWithRetry<T>(operation: (prisma: PrismaClient) => Promise<T>, maxRetries?: number): Promise<T>;
}
