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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const auth_decorator_1 = require("../../decorators/auth/auth.decorator");
const config_1 = require("@nestjs/config");
let AuthGuard = class AuthGuard {
    constructor(jwtService, reflector, configService) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.configService = configService;
    }
    async canActivate(context) {
        try {
            const isPublic = this.isPublicRoute(context);
            if (isPublic)
                return true;
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromRequest(request);
            if (!token)
                throw new common_1.UnauthorizedException('Invalid token');
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || this.configService.get('JWT_SECRET'),
            });
            request['user'] = payload;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    extractTokenFromRequest(request) {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        if (!token)
            throw new common_1.UnauthorizedException();
        return token;
    }
    isPublicRoute(context) {
        return this.reflector.getAllAndOverride(auth_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        config_1.ConfigService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map