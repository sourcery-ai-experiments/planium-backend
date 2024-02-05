"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const companies_service_1 = require("./companies.service");
const companies_controller_1 = require("./companies.controller");
const Company_1 = require("../../schemas/Company");
const workers_module_1 = require("../workers/workers.module");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: Company_1.Company.name, schema: Company_1.CompanySchema }]),
            workers_module_1.WorkersModule,
        ],
        providers: [companies_service_1.CompaniesService],
        controllers: [companies_controller_1.CompaniesController],
        exports: [companies_service_1.CompaniesService],
    })
], CompaniesModule);
//# sourceMappingURL=companies.module.js.map