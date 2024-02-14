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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const mongoose_2 = require("mongoose");
const Task_1 = require("../../schemas/Task");
const projects_service_1 = require("../projects/projects.service");
const Task_2 = require("../../types/Task");
let TasksService = class TasksService {
    constructor(taskModel, request, projectsService) {
        this.taskModel = taskModel;
        this.request = request;
        this.projectsService = projectsService;
    }
    async create(createTaskDto, companyId) {
        const userId = new mongoose_2.Types.ObjectId(this.request.user['userId']);
        createTaskDto.projectId = new mongoose_2.Types.ObjectId(createTaskDto.projectId);
        const existProject = await this.projectsService.findById(createTaskDto.projectId);
        if (!existProject) {
            throw new common_1.NotFoundException('El id del proyecto no existe');
        }
        if (createTaskDto?.workerId) {
            createTaskDto.workerId = new mongoose_2.Types.ObjectId(createTaskDto.workerId);
        }
        try {
            await this.taskModel.create({
                ...createTaskDto,
                companyId,
                workerId: createTaskDto?.workerId ? createTaskDto.workerId : userId,
                createdBy: userId,
                updatedBy: userId,
            });
            return {
                message: 'Tarea creada con éxito.',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getAll(companyId) {
        const tasks = await this.taskModel.aggregate([
            {
                $match: {
                    companyId,
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                },
            },
        ]);
        return tasks;
    }
    async getById(taskId, companyId) {
        const task = await this.taskModel.aggregate([
            {
                $match: {
                    _id: taskId,
                    companyId,
                },
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'files',
                    foreignField: '_id',
                    as: 'files',
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    type: 1,
                    supervisor: 1,
                    floor: 1,
                    cost: 1,
                    startDate: 1,
                    endDate: 1,
                    files: {
                        _id: 1,
                        url: 1,
                    },
                },
            },
        ]);
        if (!task) {
            throw new common_1.NotFoundException('La tarea no existe');
        }
        return task;
    }
    async taskReview(files, taskId, companyId) {
        const userId = new mongoose_2.Types.ObjectId(this.request.user['userId']);
        const task = await this.taskModel.findOne({
            _id: taskId,
            companyId,
        });
        if (!task) {
            throw new common_1.NotFoundException('La tarea no existe');
        }
        if (task.status === Task_2.TaskStatus.WAITING_APPROVAL) {
            throw new common_1.BadRequestException('La tarea ya fue enviada para revisión');
        }
        if (task.status === Task_2.TaskStatus.DONE) {
            throw new common_1.BadRequestException('La tarea ya fue completada');
        }
        const filesObjectIds = files.map((file) => new mongoose_2.Types.ObjectId(file));
        task.files = filesObjectIds;
        task.status = Task_2.TaskStatus.WAITING_APPROVAL;
        task.updatedAt = new Date().getTime();
        task.updatedBy = userId;
        await task.save();
        return {
            message: 'Tarea enviada para revisión.',
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Task_1.Task.name)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, projects_service_1.ProjectsService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map