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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const company_id_decorator_1 = require("../../decorators/company-id.decorator");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const mongo_id_pipe_1 = require("../../pipes/mongo-id.pipe");
const Task_1 = require("../../types/Task");
const User_1 = require("../../types/User");
const user_type_decorator_1 = require("../../decorators/auth/user-type.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const upload_files_dto_1 = require("./dto/upload-files.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async getAll(projectId, workerId, status, type, companyId) {
        return await this.tasksService.getAll(companyId, projectId, workerId, status, type);
    }
    async getTaskById(taskId, companyId) {
        return await this.tasksService.getById(taskId, companyId);
    }
    async create(createTaskDto, req, companyId) {
        if (req.user.type === User_1.UserType.WORKER) {
            createTaskDto.workerId = new mongoose_1.Types.ObjectId(req.user.sub);
        }
        if (!createTaskDto?.workerId) {
            throw new common_1.BadRequestException('El campo workerId es requerido');
        }
        return await this.tasksService.create(createTaskDto, companyId);
    }
    async startTask(taskId, companyId) {
        return await this.tasksService.startTask(taskId, companyId);
    }
    async taskReview(taskId, companyId) {
        return await this.tasksService.taskReview(taskId, companyId);
    }
    manageTaskFiles(taskId, files, body, companyId) {
        const filesToDelete = body.filesToDelete?.map((fileId) => new mongoose_1.Types.ObjectId(fileId));
        if (!filesToDelete && !files) {
            throw new common_1.BadRequestException('Debe seleccionar al menos una imagen para subir o eliminar');
        }
        return this.tasksService.manageTaskFiles(taskId, companyId, files, filesToDelete);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, common_1.Query)('workerId', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(2, (0, common_1.Query)('status', new common_1.ParseEnumPipe(Task_1.TaskStatus, { optional: true }))),
    __param(3, (0, common_1.Query)('type', new common_1.ParseEnumPipe(Task_1.TaskType, { optional: true }))),
    __param(4, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId, String, String, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    (0, common_1.Patch)('start/:id'),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "startTask", null);
__decorate([
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    (0, common_1.Patch)('review/:id'),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "taskReview", null);
__decorate([
    (0, user_type_decorator_1.UserTypes)(User_1.UserType.WORKER),
    (0, common_1.Patch)('upload/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Array,
        upload_files_dto_1.UploadFilesDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "manageTaskFiles", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map