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
exports.WorkersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Worker_1 = require("../../schemas/Worker");
const users_service_1 = require("../users/users.service");
const projects_service_1 = require("../projects/projects.service");
const companies_service_1 = require("../companies/companies.service");
const User_1 = require("../../types/User");
const generate_data_1 = require("../../helpers/generate-data");
let WorkersService = class WorkersService {
    constructor(workerModel, companiesService, userService, projectsService, connection) {
        this.workerModel = workerModel;
        this.companiesService = companiesService;
        this.userService = userService;
        this.projectsService = projectsService;
        this.connection = connection;
    }
    async findAll() {
        try {
            return this.workerModel.find().exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findById(id) {
        try {
            return this.workerModel.findById(id).exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findOne(where) {
        try {
            return this.workerModel.findOne(where).exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async create(worker, companyId) {
        const company = await this.validateCompanyExists(companyId);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const user = await this.createUser(worker, company, session);
            const newWorker = await this.createWorker(user.data._id, companyId, session);
            await this.assingWorkerToProject(worker.projectId, newWorker._id, companyId, session);
            await session.commitTransaction();
            return { message: 'Operario creado correctamente' };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async changePassword(userId, password) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('El usuario no existe');
        }
        try {
            await this.userService.changePassword(userId, password);
            return { message: 'Contraseña actualizada correctamente' };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async validateCompanyExists(companyId) {
        const company = await this.companiesService.findById(companyId);
        if (!company) {
            throw new common_1.UnauthorizedException('La empresa no existe');
        }
        return company;
    }
    async createUser(worker, company, session) {
        const username = (0, generate_data_1.generateUsername)(worker.username, company.publicId);
        const userBody = {
            name: worker.name,
            username,
            email: worker.email,
            password: this.generateTemporalPassword(),
            type: User_1.UserType.WORKER,
            companyId: company._id,
        };
        return await this.userService.create(userBody, session);
    }
    async createWorker(userId, companyId, session) {
        const newWorker = await this.workerModel.create([
            {
                companyId,
                userId,
            },
        ], { session });
        return newWorker[0];
    }
    async assingWorkerToProject(projectId, workerId, companyId, session) {
        projectId = new mongoose_2.Types.ObjectId(projectId);
        await this.projectsService.addWorkers(projectId, [workerId.toString()], companyId, session);
    }
    generateTemporalPassword() {
        return Math.random().toString(36).slice(-8);
    }
};
exports.WorkersService = WorkersService;
exports.WorkersService = WorkersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Worker_1.Worker.name)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        companies_service_1.CompaniesService,
        users_service_1.UsersService,
        projects_service_1.ProjectsService,
        mongoose_2.Connection])
], WorkersService);
//# sourceMappingURL=workers.service.js.map