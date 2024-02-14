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
const workers_service_1 = require("./workers.service");
const create_worker_dto_1 = require("./dto/create-worker.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
let WorkersController = class WorkersController {
    constructor(workersService) {
        this.workersService = workersService;
    }
    async create(createWorkerDto) {
        return this.workersService.create(createWorkerDto);
    }
    async changePassword(changePasswordDto) {
        const { userId, password } = changePasswordDto;
        return this.workersService.changePassword(new mongoose_1.Types.ObjectId(userId), password);
    }
};
exports.WorkersController = WorkersController;
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_worker_dto_1.CreateWorkerDto]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "create", null);
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], WorkersController.prototype, "changePassword", null);
exports.WorkersController = WorkersController = __decorate([
    (0, common_1.Controller)('workers'),
    __metadata("design:paramtypes", [workers_service_1.WorkersService])
], WorkersController);
//# sourceMappingURL=workers.controller.js.map