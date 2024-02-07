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
exports.WorkdaySchema = exports.Workday = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const methods_1 = require("./methods");
const Workday_1 = require("../types/Workday");
let Workday = class Workday {
};
exports.Workday = Workday;
__decorate([
    (0, mongoose_1.Prop)({ default: Number(new Date()) }),
    __metadata("design:type", Number)
], Workday.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Number(new Date().getTime()) }),
    __metadata("design:type", Number)
], Workday.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Number)
], Workday.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Workday_1.WorkdayType }),
    __metadata("design:type", String)
], Workday.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Workday.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workday.prototype, "fileId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workday.prototype, "workerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workday.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workday.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Workday.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Workday.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Workday.prototype, "updatedBy", void 0);
exports.Workday = Workday = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], Workday);
exports.WorkdaySchema = mongoose_1.SchemaFactory.createForClass(Workday);
exports.WorkdaySchema.statics.findByCompany = methods_1.findByCompany;
//# sourceMappingURL=Workday.js.map