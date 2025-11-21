"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAuditLogDto) {
        return this.prisma.auditLog.create({
            data: createAuditLogDto,
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findAll(filters, pagination = {}) {
        const { page = 1, limit = 50 } = pagination;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.entity)
            where.entity = filters.entity;
        if (filters.entityId)
            where.entity_id = filters.entityId;
        if (filters.actorUserId)
            where.actor_user_id = filters.actorUserId;
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!log) {
            throw new common_1.NotFoundException('Audit log not found');
        }
        return log;
    }
    async remove(id) {
        const log = await this.prisma.auditLog.findUnique({
            where: { id },
        });
        if (!log) {
            throw new common_1.NotFoundException('Audit log not found');
        }
        return this.prisma.auditLog.delete({
            where: { id },
        });
    }
    async logAction(actorUserId, action, entity, entityId, diffJson, ipAddress, userAgent) {
        return this.create({
            actor_user_id: actorUserId,
            action,
            entity,
            entity_id: entityId,
            diff_json: diffJson,
            ip_address: ipAddress,
            user_agent: userAgent,
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map