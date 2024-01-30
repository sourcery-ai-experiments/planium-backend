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
const User_1 = require("../../types/User");
let WorkersService = class WorkersService {
    constructor(workerModel, userService) {
        this.workerModel = workerModel;
        this.userService = userService;
    }
    async create(worker) {
        const userBody = {
            name: worker.name,
            email: worker.email,
            password: worker.password,
            phone: worker.phone,
            nationality: worker.nationality,
            type: User_1.UserType.WORKER,
        };
        const workerBody = {
            personalInformation: worker?.personalInformation,
            emergencyContact: worker?.emergencyContact,
            fileId: worker?.fileId,
        };
        const user = await this.userService.create(userBody);
        try {
            await this.workerModel.create({
                ...workerBody,
                userId: user.data._id,
            });
            return {
                message: 'Operario creado correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async changePassword(userId, password) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('El usuario no existe');
        }
        try {
            await this.userService.changePassword(userId, password);
            return {
                message: 'Contraseña actualizada correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
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
};
exports.WorkersService = WorkersService;
exports.WorkersService = WorkersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Worker_1.Worker.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], WorkersService);
//# sourceMappingURL=workers.service.js.map