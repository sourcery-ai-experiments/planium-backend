"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("../users/users.module");
const companies_module_1 = require("../companies/companies.module");
const company_users_service_1 = require("./company_users.service");
const company_users_controller_1 = require("./company_users.controller");
const CompanyUser_1 = require("../../schemas/CompanyUser");
let CompanyUsersModule = class CompanyUsersModule {
};
exports.CompanyUsersModule = CompanyUsersModule;
exports.CompanyUsersModule = CompanyUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: CompanyUser_1.CompanyUser.name, schema: CompanyUser_1.CompanyUserSchema },
            ]),
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
        ],
        providers: [company_users_service_1.CompanyUsersService],
        controllers: [company_users_controller_1.CompanyUsersController],
        exports: [company_users_service_1.CompanyUsersService],
    })
], CompanyUsersModule);
//# sourceMappingURL=company_users.module.js.map