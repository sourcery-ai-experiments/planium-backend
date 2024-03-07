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
const files_service_1 = require("../files/files.service");
const Task_2 = require("../../types/Task");
const File_1 = require("../../types/File");
let TasksService = class TasksService {
    constructor(taskModel, request, projectsService, filesService, connection) {
        this.taskModel = taskModel;
        this.request = request;
        this.projectsService = projectsService;
        this.filesService = filesService;
        this.connection = connection;
    }
    async getAll(companyId, projectId, status, type) {
        const query = {
            companyId,
            projectId,
        };
        if (status)
            query['status'] = status;
        if (type)
            query['type'] = type;
        await this.verifyExistProject(projectId);
        const tasks = await this.taskModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    type: 1,
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
    async create(createTaskDto, companyId) {
        createTaskDto.projectId = new mongoose_2.Types.ObjectId(createTaskDto.projectId);
        const { projectId, workerId } = createTaskDto;
        await this.verifyExistProject(projectId);
        await this.verifyWorkerIsInProject(projectId, workerId);
        try {
            await this.taskModel.create({
                ...createTaskDto,
                companyId,
                workerId,
                createdBy: workerId,
                updatedBy: workerId,
            });
            return {
                message: 'Tarea creada con éxito.',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async startTask(taskId, file, companyId) {
        const subId = new mongoose_2.Types.ObjectId(this.request.user['sub']);
        const task = await this.taskModel.findOne({
            _id: taskId,
            companyId,
        });
        if (!task) {
            throw new common_1.NotFoundException('La tarea no existe');
        }
        if (task.status !== Task_2.TaskStatus.TO_DO) {
            throw new common_1.BadRequestException('La tarea ya fue iniciada');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const { originalname, buffer } = file;
            const newFile = await this.filesService.uploadOneFile(originalname, buffer, File_1.Folder.WORKER_WORKDAY, companyId, session);
            task.files = [newFile.id];
            task.status = Task_2.TaskStatus.IN_PROGRESS;
            task.updatedAt = new Date().getTime();
            task.updatedBy = subId;
            await this.taskModel.updateOne({ _id: taskId }, task, { session });
            await session.commitTransaction();
            return {
                message: 'Tarea iniciada.',
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async taskReview(files, taskId, companyId) {
        const subId = new mongoose_2.Types.ObjectId(this.request.user['sub']);
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
        task.updatedBy = subId;
        await task.save();
        return {
            message: 'Tarea enviada para revisión.',
        };
    }
    async verifyExistProject(projectId) {
        const existProject = await this.projectsService.findById(projectId);
        if (!existProject) {
            throw new common_1.NotFoundException('El proyecto no existe');
        }
    }
    async verifyWorkerIsInProject(projectId, workerId) {
        const project = await this.projectsService.findById(projectId);
        const workerIsInProject = project.workers.some((id) => workerId.equals(id));
        if (!workerIsInProject) {
            throw new common_1.BadRequestException('El Operario no pertenece al proyecto');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Task_1.Task.name)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, projects_service_1.ProjectsService,
        files_service_1.FilesService,
        mongoose_2.Connection])
], TasksService);
//# sourceMappingURL=tasks.service.js.map