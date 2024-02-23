"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const workers_service_1 = require("./workers.service");
const users_module_1 = require("../users/users.module");
const Worker_1 = require("../../schemas/Worker");
const workers_controller_1 = require("./workers.controller");
const projects_module_1 = require("../projects/projects.module");
const companies_module_1 = require("../companies/companies.module");
const aws_module_1 = require("../aws/aws.module");
let WorkersModule = class WorkersModule {
};
exports.WorkersModule = WorkersModule;
exports.WorkersModule = WorkersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            companies_module_1.CompaniesModule,
            projects_module_1.ProjectsModule,
            users_module_1.UsersModule,
            aws_module_1.AwsModule,
            mongoose_1.MongooseModule.forFeature([{ name: Worker_1.Worker.name, schema: Worker_1.WorkerSchema }]),
        ],
        providers: [workers_service_1.WorkersService],
        controllers: [workers_controller_1.WorkersController],
        exports: [workers_service_1.WorkersService],
    })
], WorkersModule);
//# sourceMappingURL=workers.module.js.map