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
exports.OtpsController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../../decorators/auth/auth.decorator");
const otp_service_1 = require("./otp.service");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const mongoose_1 = require("mongoose");
let OtpsController = class OtpsController {
    constructor(otpService) {
        this.otpService = otpService;
    }
    verifyOTP(verifyOtpDto) {
        const { otp, userId } = verifyOtpDto;
        const id = new mongoose_1.Types.ObjectId(userId);
        return this.otpService.verifyOTP(otp, id);
    }
};
exports.OtpsController = OtpsController;
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, auth_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], OtpsController.prototype, "verifyOTP", null);
exports.OtpsController = OtpsController = __decorate([
    (0, common_1.Controller)('otps'),
    __metadata("design:paramtypes", [otp_service_1.OtpsService])
], OtpsController);
//# sourceMappingURL=otps.controller.js.map