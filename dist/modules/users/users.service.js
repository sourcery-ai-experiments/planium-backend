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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const User_1 = require("../../schemas/User");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(user) {
        const existEmail = await this.verifyEmailExists(user.email);
        if (existEmail) {
            throw new common_1.BadRequestException('El correo electrónico ya existe');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const newUser = await this.userModel.create(user);
        const { password, ...userData } = newUser.toObject();
        return {
            message: 'Usuario creado correctamente',
            data: userData,
        };
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.BadRequestException('El usuario no existe');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto);
        const { password, ...userData } = updatedUser.toObject();
        return {
            message: 'Usuario actualizado correctamente',
            data: userData,
        };
    }
    async findById(id) {
        try {
            return this.userModel.findById(id).exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findOne(where) {
        try {
            return this.userModel.findOne(where).exec();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async verifyEmailExists(email) {
        try {
            return await this.findOne({ email });
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map