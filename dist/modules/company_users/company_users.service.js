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
exports.CompanyUsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const CompanyUser_1 = require("../../schemas/CompanyUser");
const User_1 = require("../../types/User");
const users_service_1 = require("../users/users.service");
const companies_service_1 = require("../companies/companies.service");
let CompanyUsersService = class CompanyUsersService {
    constructor(companyUserModel, usersService, companiesService, connection) {
        this.companyUserModel = companyUserModel;
        this.usersService = usersService;
        this.companiesService = companiesService;
        this.connection = connection;
    }
    async create(companyUser) {
        const session = await this.connection.startSession();
        session.startTransaction();
        const company = await this.companiesService.create({
            name: companyUser.companyName,
        }, session);
        const userBody = {
            name: companyUser.name,
            email: companyUser.email,
            password: companyUser.password,
            phone: companyUser.phone,
            countryId: new mongoose_2.Types.ObjectId(companyUser.countryId),
            type: User_1.UserType.COMPANY_USER,
            companyId: company.data._id,
        };
        const user = await this.usersService.create(userBody, session);
        const companyUserBody = {
            roleId: new mongoose_2.Types.ObjectId(companyUser.roleId),
            companyId: company.data._id,
        };
        try {
            await this.companyUserModel.create([
                {
                    ...companyUserBody,
                    userId: user.data._id,
                },
            ], { session });
            await session.commitTransaction();
            return {
                message: 'Usuario creado correctamente',
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error(error);
        }
        finally {
            session.endSession();
        }
    }
    async findByUserId(userId) {
        return await this.companyUserModel.findOne({ userId });
    }
};
exports.CompanyUsersService = CompanyUsersService;
exports.CompanyUsersService = CompanyUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(CompanyUser_1.CompanyUser.name)),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        companies_service_1.CompaniesService,
        mongoose_2.Connection])
], CompanyUsersService);
//# sourceMappingURL=company_users.service.js.map