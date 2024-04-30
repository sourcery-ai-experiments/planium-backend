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
    async getAll(companyId, projectId, workerId, status, type) {
        const query = {
            companyId,
            projectId,
        };
        if (status)
            query['status'] = status;
        if (type)
            query['type'] = type;
        if (workerId)
            query['workerId'] = workerId;
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
        return {
            data: tasks,
        };
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
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: '_id',
                    as: 'project',
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
                $unwind: '$project',
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
                    createdAt: 1,
                    files: {
                        _id: 1,
                        url: 1,
                    },
                    project: {
                        _id: 1,
                        name: 1,
                    },
                },
            },
        ]);
        if (!task) {
            throw new common_1.NotFoundException('La tarea no existe');
        }
        return {
            data: task[0],
        };
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
        const task = await this.verifyTaskExist(taskId, companyId);
        if (task.status !== Task_2.TaskStatus.TO_DO) {
            throw new common_1.BadRequestException('La tarea ya fue iniciada');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const { originalname, buffer } = file;
            const newFile = await this.filesService.uploadOneFile(originalname, buffer, File_1.Folder.COMPANY_PROJECT_TASK, companyId, session);
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
    async taskReview(taskId, companyId) {
        const subId = new mongoose_2.Types.ObjectId(this.request.user['sub']);
        const task = await this.verifyTaskExist(taskId, companyId);
        if (task.status !== Task_2.TaskStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('La tarea no se encuentra en progreso');
        }
        task.status = Task_2.TaskStatus.WAITING_APPROVAL;
        task.updatedAt = new Date().getTime();
        task.updatedBy = subId;
        await task.save();
        return {
            message: 'Tarea enviada para revisión.',
        };
    }
    async manageTaskFiles(taskId, companyId, files, filesToDelete) {
        const subId = new mongoose_2.Types.ObjectId(this.request.user['sub']);
        const task = await this.verifyTaskExist(taskId, companyId);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (filesToDelete) {
                await this.removeFilesFromTask(task, filesToDelete, subId, companyId, session);
            }
            if (files) {
                await this.uploadFilesToTask(task, subId, companyId, files, session);
            }
            await session.commitTransaction();
            return {
                message: 'Imagenes actualizadas con éxito.',
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
    async uploadFilesToTask(task, updateBy, companyId, files, session = null) {
        const newFiles = await this.filesService.uploadManyFiles(files, File_1.Folder.COMPANY_PROJECT_TASK, companyId, session);
        task.files = [...task.files, ...newFiles.map((file) => file.id)];
        task.updatedAt = new Date().getTime();
        task.updatedBy = updateBy;
        await this.taskModel.updateOne({ _id: task._id }, task, { session });
    }
    async removeFilesFromTask(task, filesToDelete, updateBy, companyId, session = null) {
        await this.filesService.deleteManyFiles(filesToDelete, companyId, session);
        task.files = task.files.filter((fileId) => !filesToDelete.includes(fileId));
        task.updatedAt = new Date().getTime();
        task.updatedBy = updateBy;
        await this.taskModel.updateOne({ _id: task._id }, task, { session });
    }
    async verifyTaskExist(taskId, companyId) {
        const task = await this.taskModel.findOne({
            _id: taskId,
            companyId,
        });
        if (!task) {
            throw new common_1.NotFoundException('La tarea no existe');
        }
        return task;
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