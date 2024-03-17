"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const Task_1 = require("../../schemas/Task");
const tasks_service_1 = require("./tasks.service");
const tasks_controller_1 = require("./tasks.controller");
const projects_module_1 = require("../projects/projects.module");
const files_module_1 = require("../files/files.module");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            files_module_1.FilesModule,
            projects_module_1.ProjectsModule,
            mongoose_1.MongooseModule.forFeature([{ name: Task_1.Task.name, schema: Task_1.TaskSchema }]),
        ],
        providers: [tasks_service_1.TasksService],
        controllers: [tasks_controller_1.TasksController],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map