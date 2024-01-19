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
const bcrypt = require("bcrypt");
const Worker_1 = require("../../schemas/Worker");
let WorkersService = class WorkersService {
    constructor(workerModel) {
        this.workerModel = workerModel;
    }
    async create(worker) {
        const existEmail = await this.verifyEmailExists(worker.email);
        if (existEmail) {
            throw new common_1.BadRequestException('El correo electrónico ya existe');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(worker.password, salt);
        worker.password = hashedPassword;
        const newWorker = await this.workerModel.create(worker);
        const { password, ...workerData } = newWorker.toObject();
        return {
            message: 'Operario creado correctamente',
            data: workerData,
        };
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
    async verifyEmailExists(email) {
        try {
            return await this.findOne({ email });
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], WorkersService);
//# sourceMappingURL=workers.service.js.map