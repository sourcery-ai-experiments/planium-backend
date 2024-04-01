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
exports.WorkersController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const auth_decorator_1 = require("../../decorators/auth/auth.decorator");
const mongo_id_pipe_1 = require("../../pipes/mongo-id.pipe");
const company_id_decorator_1 = require("../../decorators/company-id.decorator");
const workers_service_1 = require("./workers.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const create_worker_dto_1 = require("./dto/create-worker.dto");
const update_worker_dto_1 = require("./dto/update-worker.dto");
const platform_express_1 = require("@nestjs/platform-express");
let WorkersController = class WorkersController {
    constructor(workersService) {
        this.workersService = workersService;
    }
    async create(createWorkerDto, companyId) {
        return this.workersService.create(createWorkerDto, companyId);
    }
    async update(workerId, updateWorkerDto, companyId, file) {
        return this.workersService.update(workerId, updateWorkerDto, companyId, file);
    }
    async uploadAvatar(workerId, companyId, file) {
        return this.workersService.uploadAvatar(file, workerId, companyId);
    }
    async changePassword(userId, changePasswordDto) {
        const { password } = changePasswordDto;
        return this.workersService.changePassword(userId, password);
    }
};
exports.WorkersController = WorkersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_worker_dto_1.CreateWorkerDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('w9')),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, update_worker_dto_1.UpdateWorkerDto, mongoose_1.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('avatar/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.MaxFileSizeValidator({ maxSize: 1024 * 1024 * 20 })],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "uploadAvatar", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Patch)('change-password/:id'),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "changePassword", null);
exports.WorkersController = WorkersController = __decorate([
    (0, common_1.Controller)('workers'),
    __metadata("design:paramtypes", [workers_service_1.WorkersService])
], WorkersController);
//# sourceMappingURL=workers.controller.js.map