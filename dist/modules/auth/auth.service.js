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
const mongoose_1 = require("mongoose");
const users_service_1 = require("../users/users.service");
const otps_service_1 = require("../otps/otps.service");
const aws_ses_service_1 = require("../aws/aws.ses.service");
const aws_sns_service_1 = require("../aws/aws.sns.service");
const company_users_service_1 = require("../company_users/company_users.service");
const workers_service_1 = require("../workers/workers.service");
const User_1 = require("../../types/User");
let AuthService = class AuthService {
    constructor(userService, jwtService, otpService, sesService, snsService, companyUserService, workerService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.sesService = sesService;
        this.snsService = snsService;
        this.companyUserService = companyUserService;
        this.workerService = workerService;
        this.sendRecoveryEmail = async (email) => {
            const user = await this.userService.findOne({ email });
            if (!user) {
                throw new common_1.UnauthorizedException('El correo electrónico no está registrado');
            }
            const otp = await this.otpService.generateOTP(user._id);
            return {
                message: 'Email enviado correctamente',
                data: {
                    userId: user._id,
                },
            };
        };
    }
    async signIn(username, password) {
        const user = await this.userService.findOne({ username });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const isMatch = await this.comparePasswords(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const payload = await this.getPayload(user);
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
    async validateSession(userId, companyId) {
        const user = await this.userService.findOne({ _id: userId, companyId });
        if (!user) {
            throw new common_1.UnauthorizedException('Sesión no válida');
        }
        const { password, createdAt, updatedAt, companyId: company, ...userData } = user;
        return {
            message: 'Usuario verificado correctamente',
            data: userData,
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
    async sendRecoverySms(phone, countryCode) {
        const user = await this.userService.findOne({
            'phone.number': phone,
            'phone.countryCode': countryCode,
        });
        if (!user) {
            throw new common_1.UnauthorizedException('El número de teléfono no está registrado');
        }
        const otp = await this.otpService.generateOTP(user._id);
        await this.snsService.publishSmsToPhone(`+${countryCode}${phone}`, `Tu código de recuperación es ${otp}`);
        return {
            message: 'SMS enviado correctamente',
            data: {
                userId: user._id,
            },
        };
    }
    async verifyRecoveryCode(otp, userId) {
        const response = await this.otpService.verifyOTP(otp, new mongoose_1.Types.ObjectId(userId));
        return {
            message: response.message,
        };
    }
    async getPayload(user) {
        let payload = {};
        if (user.type === User_1.UserType.COMPANY_USER) {
            const companyUser = await this.companyUserService.findByUserId(user._id);
            if (!companyUser) {
                throw new common_1.UnauthorizedException('Usuario no tiene una empresa asignada');
            }
            payload = {
                sub: companyUser._id,
                companyId: companyUser.companyId,
            };
        }
        else {
            const worker = await this.workerService.findOne({ userId: user._id });
            if (!worker) {
                throw new common_1.UnauthorizedException('Usuario no tiene un operario asignado');
            }
            payload = {
                sub: worker._id,
                companyId: worker.companyId,
            };
        }
        payload['userId'] = user._id;
        payload['type'] = user.type;
        return payload;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        otps_service_1.OtpsService,
        aws_ses_service_1.SesService,
        aws_sns_service_1.SnsService,
        company_users_service_1.CompanyUsersService,
        workers_service_1.WorkersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map