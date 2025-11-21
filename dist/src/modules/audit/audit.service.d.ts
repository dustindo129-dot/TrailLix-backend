import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAuditLogDto } from './dto';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAuditLogDto: CreateAuditLogDto): Promise<{
        actor: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        created_at: Date;
        actor_user_id: string;
        action: string;
        entity: string;
        entity_id: string;
        diff_json: import("@prisma/client/runtime/library").JsonValue | null;
        ip_address: string | null;
        user_agent: string | null;
    }>;
    findAll(filters: {
        entity?: string;
        entityId?: string;
        actorUserId?: string;
    }, pagination?: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            created_at: Date;
            actor_user_id: string;
            action: string;
            entity: string;
            entity_id: string;
            diff_json: import("@prisma/client/runtime/library").JsonValue | null;
            ip_address: string | null;
            user_agent: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        actor: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        created_at: Date;
        actor_user_id: string;
        action: string;
        entity: string;
        entity_id: string;
        diff_json: import("@prisma/client/runtime/library").JsonValue | null;
        ip_address: string | null;
        user_agent: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        actor_user_id: string;
        action: string;
        entity: string;
        entity_id: string;
        diff_json: import("@prisma/client/runtime/library").JsonValue | null;
        ip_address: string | null;
        user_agent: string | null;
    }>;
    logAction(actorUserId: string, action: string, entity: string, entityId: string, diffJson?: any, ipAddress?: string, userAgent?: string): Promise<{
        actor: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        created_at: Date;
        actor_user_id: string;
        action: string;
        entity: string;
        entity_id: string;
        diff_json: import("@prisma/client/runtime/library").JsonValue | null;
        ip_address: string | null;
        user_agent: string | null;
    }>;
}
