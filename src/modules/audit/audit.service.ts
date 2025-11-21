import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAuditLogDto } from './dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
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

  async findAll(
    filters: { entity?: string; entityId?: string; actorUserId?: string },
    pagination: { page?: number; limit?: number } = {},
  ) {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.entity) where.entity = filters.entity;
    if (filters.entityId) where.entity_id = filters.entityId;
    if (filters.actorUserId) where.actor_user_id = filters.actorUserId;

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

  async findOne(id: string) {
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
      throw new NotFoundException('Audit log not found');
    }

    return log;
  }

  async remove(id: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException('Audit log not found');
    }

    return this.prisma.auditLog.delete({
      where: { id },
    });
  }

  // Utility method to log actions
  async logAction(
    actorUserId: string,
    action: string,
    entity: string,
    entityId: string,
    diffJson?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
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
}
