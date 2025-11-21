import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
        data: {
            tokens: {
                access_token: string;
                refresh_token: string;
                expires_in: number;
            };
        };
        message: string;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
        message: string;
    }>;
}
