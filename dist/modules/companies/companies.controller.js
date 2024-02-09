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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const company_id_decorator_1 = require("../../decorators/auth/company-id.decorator");
const mongo_id_pipe_1 = require("../../pipes/mongo-id.pipe");
const companies_service_1 = require("./companies.service");
const worker_dto_1 = require("./dto/worker.dto");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findAllByWorkerId(workerId) {
        return this.companiesService.findAllByWorkerId(workerId);
    }
    async addWorker(worker, companyId) {
        worker.workerId = new mongoose_1.Types.ObjectId(worker.workerId);
        return this.companiesService.addWorker(companyId, worker);
    }
    async removeWorker(worker, companyId) {
        worker.workerId = new mongoose_1.Types.ObjectId(worker.workerId);
        return this.companiesService.removeWorker(companyId, worker.workerId);
    }
    async updateWorker(worker, companyId) {
        worker.workerId = new mongoose_1.Types.ObjectId(worker.workerId);
        return this.companiesService.updateWorker(companyId, worker);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)('by-worker/:id'),
    __param(0, (0, common_1.Param)('id', mongo_id_pipe_1.ParseMongoIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAllByWorkerId", null);
__decorate([
    (0, common_1.Patch)('workers/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [worker_dto_1.WorkerDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "addWorker", null);
__decorate([
    (0, common_1.Patch)('workers/remove'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [worker_dto_1.RemoveWorkerDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "removeWorker", null);
__decorate([
    (0, common_1.Patch)('workers/update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, company_id_decorator_1.CompanyId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [worker_dto_1.WorkerDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "updateWorker", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map