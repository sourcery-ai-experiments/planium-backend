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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Company_1 = require("../../schemas/Company");
const workers_service_1 = require("../workers/workers.service");
let CompaniesService = class CompaniesService {
    constructor(companyModel, workersService) {
        this.companyModel = companyModel;
        this.workersService = workersService;
    }
    async create(company) {
        try {
            const newCompany = await this.companyModel.create(company);
            return {
                message: 'Empresa creada correctamente',
                data: newCompany,
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findAllByWorkerId(workerId) {
        try {
            const companies = await this.companyModel.aggregate([
                {
                    $match: {
                        'workers.workerId': workerId,
                    },
                },
                {
                    $project: {
                        name: 1,
                    },
                },
            ]);
            return {
                data: companies,
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findCompanyById(companyId) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Empresa no encontrada');
        }
        return company;
    }
    async addWorker(companyId, worker) {
        const company = await this.findCompanyById(companyId);
        await this.verifyExistsWorker(worker.workerId.toString());
        if (company.workers.some((w) => w.workerId.equals(worker.workerId))) {
            throw new common_1.NotFoundException('El operario ya existe');
        }
        company.workers.push(worker);
        await this.companyModel.findByIdAndUpdate(companyId, company);
        return {
            message: 'Operario agregado correctamente',
        };
    }
    async removeWorker(companyId, workerId) {
        const company = await this.findCompanyById(companyId);
        await this.verifyExistsWorker(workerId.toString());
        const workerIndex = company.workers.findIndex((worker) => worker.workerId.equals(workerId));
        if (workerIndex === -1) {
            throw new common_1.NotFoundException('Operario no encontrado');
        }
        company.workers.splice(workerIndex, 1);
        await this.companyModel.findByIdAndUpdate(companyId, company);
        return {
            message: 'Operario eliminado correctamente',
        };
    }
    async updateWorker(companyId, worker) {
        const company = await this.findCompanyById(companyId);
        await this.verifyExistsWorker(worker.workerId.toString());
        const workerIndex = company.workers.findIndex((w) => w.workerId.equals(worker.workerId));
        if (workerIndex === -1) {
            throw new common_1.NotFoundException('Operario no encontrado');
        }
        company.workers[workerIndex] = worker;
        await this.companyModel.findByIdAndUpdate(companyId, company);
        return {
            message: 'Operario actualizado correctamente',
        };
    }
    async verifyExistsWorker(workerId) {
        const worker = await this.workersService.findById(workerId);
        if (!worker) {
            throw new common_1.NotFoundException('Operario no encontrado');
        }
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Company_1.Company.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        workers_service_1.WorkersService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map