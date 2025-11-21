import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private usersService;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            avatar_url: any;
            age_range: any;
            role_description: any;
            ai_experience: any;
            skills: any;
            achievement: any;
            fields: any;
            motivations: any;
            has_completed_concepts: any;
            xp: any;
            level: any;
            streak: any;
            longest_streak: any;
        };
        tokens: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            xp: number;
            level: number;
            streak: number;
            longest_streak: number;
            avatar_url: string;
        };
        tokens: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private getTokenExpirationTime;
}
