"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const environment_validation_1 = require("./config/environment.validation");
const workers_module_1 = require("./modules/workers/workers.module");
const auth_module_1 = require("./modules/auth/auth.module");
const health_status_module_1 = require("./modules/health-status/health-status.module");
const users_module_1 = require("./modules/users/users.module");
const otps_module_1 = require("./modules/otps/otps.module");
const aws_module_1 = require("./modules/aws/aws.module");
const files_module_1 = require("./modules/files/files.module");
const companies_module_1 = require("./modules/companies/companies.module");
const company_users_module_1 = require("./modules/company_users/company_users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const workdays_module_1 = require("./modules/workdays/workdays.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.development', '.env'],
                validate: environment_validation_1.validate,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: process.env.DATABASE_URL || configService.get('DATABASE_URL'),
                }),
                inject: [config_1.ConfigService],
            }),
            workers_module_1.WorkersModule,
            auth_module_1.AuthModule,
            health_status_module_1.HealthStatusModule,
            users_module_1.UsersModule,
            otps_module_1.OtpsModule,
            aws_module_1.AwsModule,
            files_module_1.FilesModule,
            companies_module_1.CompaniesModule,
            company_users_module_1.CompanyUsersModule,
            roles_module_1.RolesModule,
            workdays_module_1.WorkdaysModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map