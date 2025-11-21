import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(id: string, data: {
    name?: string;
    avatar_url?: string;
    age_range?: string;
    role_description?: string;
    ai_experience?: string;
    skills?: string[];
    achievement?: string;
    fields?: string[];
    motivations?: string[];
    course_start_date?: string;
    has_seen_concepts_intro?: boolean;
  }) {
    // Convert course_start_date string to Date if provided
    const updateData: any = { ...data };
    if (data.course_start_date) {
      updateData.course_start_date = new Date(data.course_start_date);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          avatar_url: true,
          xp: true,
          level: true,
          streak: true,
          created_at: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
