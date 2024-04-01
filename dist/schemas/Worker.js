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
exports.WorkerSchema = exports.Worker = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Worker = class Worker {
};
exports.Worker = Worker;
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        socialSecurityNumber: { type: String },
        fileId: { type: mongoose_2.Types.ObjectId },
    })),
    __metadata("design:type", Object)
], Worker.prototype, "personalInformation", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        name: { type: String },
        phone: { type: String },
        phoneCountryCode: { type: String },
    })),
    __metadata("design:type", Object)
], Worker.prototype, "emergencyContact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Worker.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Worker.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Worker.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    __metadata("design:type", Number)
], Worker.prototype, "updatedAt", void 0);
exports.Worker = Worker = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false })
], Worker);
exports.WorkerSchema = mongoose_1.SchemaFactory.createForClass(Worker);
//# sourceMappingURL=Worker.js.map