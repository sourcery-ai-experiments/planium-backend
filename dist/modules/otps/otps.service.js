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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Otp_1 = require("../../schemas/Otp");
const random_code_1 = require("../../helpers/random-code");
let OtpsService = class OtpsService {
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    async create(otp, userId) {
        try {
            const tenMinutes = 600000;
            const expiredAt = Date.now() + tenMinutes;
            const otpData = {
                otp,
                userId,
                expiredAt,
            };
            await this.otpModel.create(otpData);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async generateOTP(userId) {
        const length = 5;
        const otp = (0, random_code_1.generateRandomCode)(length);
        await this.create(otp, userId);
        return otp;
    }
    async verifyOTP(otp, userId) {
        const otpData = await this.otpModel.findOne({ otp, userId });
        if (!otpData) {
            throw new common_1.UnauthorizedException('El código de verificación es incorrecto');
        }
        const now = Date.now();
        if (now > otpData.expiredAt) {
            throw new common_1.UnauthorizedException('El código de verificación ha expirado');
        }
        await this.deleteAll(userId);
        return {
            message: 'OTP verificado correctamente',
        };
    }
    async deleteAll(userId) {
        try {
            await this.otpModel.deleteMany({ userId });
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.OtpsService = OtpsService;
exports.OtpsService = OtpsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Otp_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OtpsService);
//# sourceMappingURL=otps.service.js.map