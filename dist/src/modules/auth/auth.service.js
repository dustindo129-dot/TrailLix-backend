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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(prisma, usersService, jwtService, configService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password_hash && await bcrypt.compare(password, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id, user.email);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { updated_at: new Date() },
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar_url: user.avatar_url,
                age_range: user.age_range,
                role_description: user.role_description,
                ai_experience: user.ai_experience,
                skills: user.skills,
                achievement: user.achievement,
                fields: user.fields,
                motivations: user.motivations,
                has_completed_concepts: user.has_seen_concepts_intro,
                xp: user.xp || 0,
                level: user.level || 1,
                streak: user.streak || 0,
                longest_streak: user.longest_streak || 0,
            },
            tokens,
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(registerDto.password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                name: registerDto.name || registerDto.email.split('@')[0],
                password_hash,
            },
        });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                xp: 0,
                level: 1,
                streak: 0,
                longest_streak: 0,
                avatar_url: user.avatar_url,
            },
            tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokens(user.id, user.email);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
        return { message: 'Logged out successfully' };
    }
    async generateTokens(userId, email) {
        const payload = { email, sub: userId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: this.configService.get('jwt.expiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
            }),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: this.getTokenExpirationTime(),
        };
    }
    getTokenExpirationTime() {
        const expiresIn = this.configService.get('jwt.expiresIn');
        if (expiresIn.endsWith('m')) {
            return parseInt(expiresIn) * 60;
        }
        else if (expiresIn.endsWith('h')) {
            return parseInt(expiresIn) * 3600;
        }
        else if (expiresIn.endsWith('d')) {
            return parseInt(expiresIn) * 86400;
        }
        return parseInt(expiresIn);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map