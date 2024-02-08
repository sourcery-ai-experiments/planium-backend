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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectSchema = exports.Project = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Project.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        name: { type: String, required: true },
        phone: { type: String, required: true },
        phoneCountryCode: { type: String, required: true },
    })),
    __metadata("design:type", Object)
], Project.prototype, "manager", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Array, default: [] }),
    __metadata("design:type", Array)
], Project.prototype, "workers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Project.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Project.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Project.prototype, "updatedBy", void 0);
exports.Project = Project = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], Project);
exports.ProjectSchema = mongoose_1.SchemaFactory.createForClass(Project);
//# sourceMappingURL=Project.js.map