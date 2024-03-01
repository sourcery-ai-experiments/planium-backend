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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const company_id_decorator_1 = require("../../decorators/company-id.decorator");
const auth_decorator_1 = require("../../decorators/auth/auth.decorator");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signIn(signInUserDto) {
        const { username, password } = signInUserDto;
        return this.authService.signIn(username, password);
    }
    validateUser(req, companyId) {
        const userId = new mongoose_1.Types.ObjectId(req.user['userId']);
        return this.authService.validateSession(userId, companyId);
    }
    refreshToken(companyId, req) {
        const subId = req.user.sub;
        const userId = req.user.userId;
        const type = req.user.type;
        const payload = {
            sub: subId,
            userId,
            companyId,
            type,
        };
        return this.authService.refreshToken(payload);
    }
    sendRecoverySms(smsRecoveryDto) {
        const { phone, countryCode } = smsRecoveryDto;
        return this.authService.sendRecoverySms(phone, countryCode);
    }
    sendRecoveryEmail(emailRecoveryDto) {
        const { email } = emailRecoveryDto;
        return this.authService.sendRecoveryEmail(email);
    }
    verifyRecoveryCode(verifyCodeDto) {
        const { otp, userId } = verifyCodeDto;
        return this.authService.verifyRecoveryCode(otp, userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SignInDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('validate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "validateUser", null);
__decorate([
    (0, common_1.Get)('refresh'),
    __param(0, (0, company_id_decorator_1.CompanyId)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Post)('recovery/sms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SmsRecoveryDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendRecoverySms", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Post)('recovery/email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.EmailRecoveryDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendRecoveryEmail", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Post)('recovery/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyCodeDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyRecoveryCode", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map