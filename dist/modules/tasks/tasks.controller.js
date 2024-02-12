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
const task_review_dto_1 = require("./dto/task-review.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(createTaskDto, companyId) {
        return await this.tasksService.create(createTaskDto, companyId);
    }
    async taskReview(taskReviewDto, taskId, companyId) {
        const { files } = taskReviewDto;
        return await this.tasksService.taskReview(files, taskId, companyId);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('review/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __param(2, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_review_dto_1.TaskReviewDto, mongoose_1.Types.ObjectId, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "taskReview", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map