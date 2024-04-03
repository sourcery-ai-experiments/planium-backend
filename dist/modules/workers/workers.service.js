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
const aws_ses_service_1 = require("../aws/aws.ses.service");
const files_service_1 = require("../files/files.service");
const User_1 = require("../../types/User");
const generate_data_1 = require("../../helpers/generate-data");
const welcome_1 = require("../../templates/email/welcome");
const File_1 = require("../../types/File");
let WorkersService = class WorkersService {
    constructor(workerModel, sesService, filesService, companiesService, userService, projectsService, connection) {
        this.workerModel = workerModel;
        this.sesService = sesService;
        this.filesService = filesService;
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
            const response = await this.workerModel.aggregate([
                {
                    $match: where,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $lookup: {
                        from: 'files',
                        localField: 'personalInformation.fileId',
                        foreignField: '_id',
                        as: 'w9File',
                    },
                },
                {
                    $unwind: '$user',
                },
                {
                    $unwind: {
                        path: '$w9File',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'files',
                        localField: 'user.fileId',
                        foreignField: '_id',
                        as: 'avatar',
                    },
                },
                {
                    $unwind: {
                        path: '$avatar',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        name: '$user.name',
                        username: '$user.username',
                        email: '$user.email',
                        phone: '$user.phone',
                        type: '$user.type',
                        file: {
                            _id: '$avatar._id',
                            url: '$avatar.url',
                        },
                        emergencyContact: 1,
                        personalInformation: {
                            socialSecurityNumber: 1,
                            file: {
                                _id: '$w9File._id',
                                url: '$w9File.url',
                            },
                        },
                        companyId: 1,
                    },
                },
            ]);
            return response[0];
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
            const temporalPassword = this.generateTemporalPassword();
            const user = await this.createUser(worker, company, session, temporalPassword);
            const newWorker = await this.createWorker(user.data._id, companyId, session);
            await this.assingWorkerToProject(worker.projectId, newWorker._id, companyId, session);
            await this.sendWelcomeEmail(worker.email, user.data.username, temporalPassword, user.data.name);
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
    async update(workerId, updateWorkerDto, companyId, file) {
        const worker = await this.workerModel.findOne({ _id: workerId, companyId });
        if (!worker) {
            throw new common_1.UnauthorizedException('El operario no existe');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.updateUser(updateWorkerDto, worker.userId, session, companyId);
            const fileId = await this.uploadW9File(file, worker, companyId, session);
            if (fileId) {
                updateWorkerDto.personalInformation = {
                    ...updateWorkerDto.personalInformation,
                    fileId,
                };
            }
            await this.workerModel.updateOne({ _id: workerId }, updateWorkerDto, {
                session,
            });
            await session.commitTransaction();
            return { message: 'Operario actualizado correctamente' };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async uploadAvatar(file, workerId, companyId) {
        const worker = await this.workerModel.findOne({ _id: workerId, companyId });
        if (!worker) {
            throw new common_1.UnauthorizedException('El operario no existe');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.userService.uploadAvatar(file, File_1.Folder.WORKER_AVATAR, worker.userId, companyId, session);
            await session.commitTransaction();
            return { message: 'Avatar actualizado correctamente' };
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
    async createUser(worker, company, session, temporalPassword) {
        const username = (0, generate_data_1.generateUsername)(worker.username, company.publicId);
        const userBody = {
            name: worker.name,
            username,
            email: worker.email,
            password: temporalPassword,
            type: User_1.UserType.WORKER,
            companyId: company._id,
        };
        return await this.userService.create(userBody, session);
    }
    async updateUser(worker, userId, session, companyId) {
        const userBody = {
            name: worker.name,
            email: worker.email,
            phone: worker.phone,
        };
        return await this.userService.update(userId, userBody, companyId, session);
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
    async sendWelcomeEmail(email, username, password, name) {
        await this.sesService.sendEmail(email, 'Bienvenido a la plataforma', (0, welcome_1.welcomeTemplate)(name, username, password));
    }
    async uploadW9File(file, worker, companyId, session) {
        if (file) {
            const fileId = worker?.personalInformation?.fileId;
            if (fileId) {
                await this.filesService.deleteOneFile(fileId, companyId, session);
            }
            const newFile = await this.filesService.uploadOneFile(file.originalname, file.buffer, File_1.Folder.WORKER_W9, companyId, session);
            return newFile.id;
        }
    }
    generateTemporalPassword() {
        return Math.random().toString(36).slice(-8);
    }
};
exports.WorkersService = WorkersService;
exports.WorkersService = WorkersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Worker_1.Worker.name)),
    __param(6, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        aws_ses_service_1.SesService,
        files_service_1.FilesService,
        companies_service_1.CompaniesService,
        users_service_1.UsersService,
        projects_service_1.ProjectsService,
        mongoose_2.Connection])
], WorkersService);
//# sourceMappingURL=workers.service.js.map