"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkdaysModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const workers_module_1 = require("../workers/workers.module");
const workdays_service_1 = require("./workdays.service");
const workdays_controller_1 = require("./workdays.controller");
const Workday_1 = require("../../schemas/Workday");
let WorkdaysModule = class WorkdaysModule {
};
exports.WorkdaysModule = WorkdaysModule;
exports.WorkdaysModule = WorkdaysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            workers_module_1.WorkersModule,
            mongoose_1.MongooseModule.forFeature([{ name: Workday_1.Workday.name, schema: Workday_1.WorkdaySchema }]),
        ],
        providers: [workdays_service_1.WorkdaysService],
        controllers: [workdays_controller_1.WorkdaysController],
    })
], WorkdaysModule);
//# sourceMappingURL=workdays.module.js.map