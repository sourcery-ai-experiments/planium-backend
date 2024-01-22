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
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
const otp_service_1 = require("../otps/otp.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, otpService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }
    async signIn(email, password) {
        const user = await this.userService.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await this.comparePasswords(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user._id,
        };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Logueado correctamente',
            data: {
                access_token: token,
            },
        };
    }
    async comparePasswords(password, storedPasswordHash) {
        return bcrypt.compare(password, storedPasswordHash);
    }
    async validateSession(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('No se encontró el usuario');
        }
        return {
            message: 'Usuario verificado correctamente',
            data: user,
        };
    }
    async refreshToken(payload) {
        const token = this.jwtService.sign(payload);
        return {
            message: 'Token actualizado',
            data: {
                access_token: token,
            },
        };
    }
    async sendRecoverySms(phone) {
        const user = await this.userService.findOne({ 'phone.number': phone });
        if (!user) {
            throw new common_1.UnauthorizedException('El número de teléfono no está registrado');
        }
        const otp = await this.otpService.generateOTP(user._id);
        return {
            message: 'SMS enviado correctamente',
            data: {
                otp,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        otp_service_1.OtpsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map