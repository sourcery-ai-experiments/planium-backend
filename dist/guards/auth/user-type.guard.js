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
exports.UserTypeGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_type_decorator_1 = require("../../decorators/auth/user-type.decorator");
let UserTypeGuard = class UserTypeGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const userTypes = this.reflector.getAllAndOverride(user_type_decorator_1.USER_TYPE_KEY, [context.getHandler(), context.getClass()]);
        const { user } = context.switchToHttp().getRequest();
        if (!userTypes) {
            return true;
        }
        return userTypes.some((userType) => user.type === userType);
    }
};
exports.UserTypeGuard = UserTypeGuard;
exports.UserTypeGuard = UserTypeGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], UserTypeGuard);
//# sourceMappingURL=user-type.guard.js.map