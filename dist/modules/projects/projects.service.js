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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const mongoose_2 = require("mongoose");
const Project_1 = require("../../schemas/Project");
let ProjectsService = class ProjectsService {
    constructor(projectModel, request) {
        this.projectModel = projectModel;
        this.request = request;
    }
    async create(createProjectDto, companyId) {
        try {
            const userId = new mongoose_2.Types.ObjectId(this.request.user['userId']);
            await this.projectModel.create({
                ...createProjectDto,
                companyId,
                createdBy: userId,
                updatedBy: userId,
            });
            return {
                message: 'Proyecto creado correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findById(id) {
        try {
            return this.projectModel.findById(id).exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getByWorkerId(workerId, companyId) {
        const projects = await this.projectModel.aggregate([
            {
                $match: {
                    companyId,
                    workers: workerId,
                },
            },
            {
                $project: {
                    name: 1,
                },
            },
        ]);
        return projects;
    }
    async addWorkers(projectId, workers, companyId, session = null) {
        const project = await this.projectModel.findOne({
            _id: projectId,
            companyId,
        }, null, { session });
        if (!project) {
            throw new common_1.NotFoundException('El proyecto no existe');
        }
        const workersObjectId = workers.map((id) => new mongoose_2.Types.ObjectId(id));
        try {
            await this.projectModel.updateOne({ _id: projectId }, {
                $addToSet: {
                    workers: { $each: workersObjectId },
                },
            });
            return {
                message: 'Operario(s) agregado(s) correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Project_1.Project.name)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map