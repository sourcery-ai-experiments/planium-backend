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
const files_service_1 = require("../files/files.service");
let UsersService = class UsersService {
    constructor(userModel, filesService) {
        this.userModel = userModel;
        this.filesService = filesService;
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
        const response = await this.userModel.aggregate([
            {
                $match: where,
            },
            {
                $lookup: {
                    from: 'files',
                    localField: 'fileId',
                    foreignField: '_id',
                    as: 'file',
                },
            },
            {
                $unwind: {
                    path: '$file',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    email: 1,
                    password: 1,
                    phone: 1,
                    type: 1,
                    file: {
                        _id: 1,
                        url: 1,
                    },
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);
        return response[0];
    }
    async create(user, session = null) {
        await this.validateUserExists(user);
        const hashedPassword = await this.hashPassword(user.password);
        user.password = hashedPassword;
        const newUser = await this.userModel.create([user], { session });
        const { password, ...userData } = newUser[0].toObject();
        return {
            message: 'Usuario creado correctamente',
            data: userData,
        };
    }
    async update(id, updateUserDto, companyId, session = null) {
        const user = await this.findOne({ _id: id, companyId });
        if (!user) {
            throw new common_1.BadRequestException('El usuario no existe');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { session });
        const { password, ...userData } = updatedUser.toObject();
        return {
            message: 'Usuario actualizado correctamente',
            data: userData,
        };
    }
    async changePassword(userId, password) {
        const hashedPassword = await this.hashPassword(password);
        await this.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
        });
    }
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt();
            return await bcrypt.hash(password, salt);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async validateUserExists(user) {
        const { username, email, companyId } = user;
        const userExist = await this.userModel.findOne({
            $or: [
                { username, companyId },
                { email, companyId },
            ],
        });
        if (userExist) {
            throw new common_1.BadRequestException('El email o el username ya están en uso dentro de la empresa');
        }
    }
    async uploadAvatar(file, folder, userId, companyId, session = null) {
        const user = await this.findOne({ _id: userId, companyId });
        if (!user) {
            throw new common_1.BadRequestException('El usuario no existe');
        }
        if (user.fileId) {
            await this.filesService.deleteOneFile(user.fileId, companyId, session);
        }
        const { originalname, buffer } = file;
        const newFile = await this.filesService.uploadOneFile(originalname, buffer, folder, companyId, session);
        await this.userModel.updateOne({ _id: userId }, { fileId: newFile.id }, { session });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        files_service_1.FilesService])
], UsersService);
//# sourceMappingURL=users.service.js.map