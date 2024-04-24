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
exports.WorkdaysController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const company_id_decorator_1 = require("../../decorators/company-id.decorator");
const user_type_decorator_1 = require("../../decorators/auth/user-type.decorator");
const User_1 = require("../../types/User");
const workdays_service_1 = require("./workdays.service");
const create_workday_dto_1 = require("./dto/create-workday.dto");
const mongo_id_pipe_1 = require("../../pipes/mongo-id.pipe");
const platform_express_1 = require("@nestjs/platform-express");
let WorkdaysController = class WorkdaysController {
    constructor(workdaysService) {
        this.workdaysService = workdaysService;
    }
    async getAll(workerId, isActive, companyId) {
        return await this.workdaysService.getAll(isActive, workerId, companyId);
    }
    async create(createWorkdayDto, req, file, companyId) {
        const workerId = new mongoose_1.Types.ObjectId(req.user.sub);
        return await this.workdaysService.create(file, createWorkdayDto, workerId, companyId);
    }
    async endWorkday(workdayId, companyId) {
        return await this.workdaysService.endWorkday(new mongoose_1.Types.ObjectId(workdayId), companyId);
    }
};
exports.WorkdaysController = WorkdaysController;
__decorate([
    (0, common_1.Get)(),
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    __param(0, (0, common_1.Query)('workerId', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, common_1.Query)('isActive', new common_1.ParseBoolPipe({ optional: true }))),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Boolean, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], WorkdaysController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
    }))),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workday_dto_1.CreateWorkdayDto, Object, Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], WorkdaysController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('/end/:id'),
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], WorkdaysController.prototype, "endWorkday", null);
exports.WorkdaysController = WorkdaysController = __decorate([
    (0, common_1.Controller)('workdays'),
    __metadata("design:paramtypes", [workdays_service_1.WorkdaysService])
], WorkdaysController);
//# sourceMappingURL=workdays.controller.js.map