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
const workers_service_1 = require("../workers/workers.service");
let WorkdaysService = class WorkdaysService {
    constructor(workdayModel, workersService) {
        this.workdayModel = workdayModel;
        this.workersService = workersService;
    }
    async create(workday, workerId, companyId) {
        workday.fileId = new mongoose_2.Types.ObjectId(workday.fileId);
        workday.projectId = new mongoose_2.Types.ObjectId(workday.projectId);
        const activeWorkday = await this.workdayModel.find({
            workerId,
            companyId,
            isActive: true,
        });
        if (activeWorkday.length > 0) {
            throw new common_1.ConflictException('El operario ya tiene una jornada en curso');
        }
        const worker = await this.workersService.findOne(workerId);
        if (!worker) {
            throw new common_1.NotFoundException('El operario no existe');
        }
        const newWorkday = {
            workerId,
            companyId,
            updatedBy: workerId,
            ...workday,
        };
        try {
            await this.workdayModel.create(newWorkday);
            return {
                message: 'Jornada creada correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        workers_service_1.WorkersService])
], WorkdaysService);
//# sourceMappingURL=workdays.service.js.map