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
exports.CompanyUsersController = void 0;
const common_1 = require("@nestjs/common");
const company_users_service_1 = require("./company_users.service");
const create_company_user_dto_1 = require("./dto/create-company-user.dto");
const auth_decorator_1 = require("../../decorators/auth/auth.decorator");
let CompanyUsersController = class CompanyUsersController {
    constructor(companyUsersService) {
        this.companyUsersService = companyUsersService;
    }
    async create(createCompanyUserDto) {
        return await this.companyUsersService.create(createCompanyUserDto);
    }
};
exports.CompanyUsersController = CompanyUsersController;
__decorate([
    (0, auth_decorator_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_user_dto_1.CreateCompanyUserDto]),
    __metadata("design:returntype", Promise)
], CompanyUsersController.prototype, "create", null);
exports.CompanyUsersController = CompanyUsersController = __decorate([
    (0, common_1.Controller)('company-users'),
    __metadata("design:paramtypes", [company_users_service_1.CompanyUsersService])
], CompanyUsersController);
//# sourceMappingURL=company_users.controller.js.map