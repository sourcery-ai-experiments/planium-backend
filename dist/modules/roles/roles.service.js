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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Role_1 = require("../../schemas/Role");
let RolesService = class RolesService {
    constructor(roleModel, request) {
        this.roleModel = roleModel;
        this.request = request;
    }
    async create(createRoleDto) {
        try {
            const subId = new mongoose_2.Types.ObjectId(this.request.user['sub']);
            const data = {
                ...createRoleDto,
                createdBy: subId,
                updatedBy: subId,
            };
            const createdRole = new this.roleModel(data);
            await createdRole.save();
            return {
                message: 'Rol creado correctamente',
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findAll() {
        try {
            return await this.roleModel.aggregate([
                {
                    $project: {
                        name: 1,
                    },
                },
            ]);
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Role_1.Role.name)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], RolesService);
//# sourceMappingURL=roles.service.js.map