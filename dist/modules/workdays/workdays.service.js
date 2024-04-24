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
exports.WorkdaysService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Workday_1 = require("../../schemas/Workday");
const projects_service_1 = require("../projects/projects.service");
const files_service_1 = require("../files/files.service");
const File_1 = require("../../types/File");
let WorkdaysService = class WorkdaysService {
    constructor(workdayModel, projectsService, filesService, connection) {
        this.workdayModel = workdayModel;
        this.projectsService = projectsService;
        this.filesService = filesService;
        this.connection = connection;
    }
    async getAll(isActive, workerId, companyId) {
        const query = {
            companyId,
        };
        if (workerId)
            query['workerId'] = workerId;
        if (isActive)
            query['isActive'] = isActive;
        const workdays = await this.workdayModel.aggregate([
            {
                $match: query,
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
                $unwind: '$project',
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    startTime: 1,
                    endTime: 1,
                    isActive: 1,
                    type: 1,
                    project: {
                        _id: 1,
                        name: 1,
                    },
                },
            },
        ]);
        return {
            data: workdays,
        };
    }
    async create(file, workday, workerId, companyId) {
        workday.projectId = new mongoose_2.Types.ObjectId(workday.projectId);
        const project = await this.projectsService.findOne({
            _id: workday.projectId,
            companyId,
        });
        if (!project) {
            throw new common_1.NotFoundException('El proyecto no existe');
        }
        const activeWorkday = await this.workdayModel.find({
            workerId,
            companyId,
            isActive: true,
        });
        if (activeWorkday.length > 0) {
            throw new common_1.ConflictException('El operario ya tiene una jornada en curso');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const { originalname, buffer } = file;
            const newFile = await this.filesService.uploadOneFile(originalname, buffer, File_1.Folder.WORKER_WORKDAY, companyId, session);
            const newWorkday = {
                fileId: newFile.id,
                workerId,
                companyId,
                updatedBy: workerId,
                ...workday,
            };
            await this.workdayModel.create([newWorkday], { session });
            await session.commitTransaction();
            return {
                message: 'Jornada iniciada correctamente',
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
    async endWorkday(workdayId, companyId) {
        const workday = await this.workdayModel.findOne({
            _id: workdayId,
            companyId,
        });
        if (!workday) {
            throw new common_1.NotFoundException('La jornada no existe');
        }
        if (workday.endTime || !workday.isActive) {
            throw new common_1.ConflictException('La jornada ya ha sido finalizada');
        }
        try {
            await this.workdayModel.updateOne({ _id: workdayId }, { endTime: Number(new Date().getTime()), isActive: false });
            return {
                message: 'Jornada finalizada correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.WorkdaysService = WorkdaysService;
exports.WorkdaysService = WorkdaysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Workday_1.Workday.name)),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        projects_service_1.ProjectsService,
        files_service_1.FilesService,
        mongoose_2.Connection])
], WorkdaysService);
//# sourceMappingURL=workdays.service.js.map