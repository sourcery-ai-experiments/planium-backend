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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const aws_s3_service_1 = require("../aws/aws.s3.service");
const File_1 = require("../../schemas/File");
const rename_file_helper_1 = require("./helpers/rename-file.helper");
let FilesService = class FilesService {
    constructor(fileModel, s3Service) {
        this.fileModel = fileModel;
        this.s3Service = s3Service;
    }
    async uploadOneFile(originalName, body, folder, companyId, session = null) {
        const key = (0, rename_file_helper_1.renameFile)(originalName);
        const newKey = `${folder}/${key}`;
        const imageUrl = await this.s3Service.uploadFile(newKey, body);
        const newFile = await this.fileModel.create([
            {
                url: imageUrl,
                key: newKey,
                companyId,
            },
        ], { session });
        return {
            id: newFile[0]._id,
            url: newFile[0].url,
        };
    }
    async deleteOneFile(fileId, companyId, session = null) {
        const file = await this.fileModel.findOneAndDelete({ _id: fileId, companyId }, { session });
        if (!file) {
            throw new common_1.NotFoundException('El archivo no existe');
        }
        await this.s3Service.deleteFile(file.key);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(File_1.File.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        aws_s3_service_1.S3Service])
], FilesService);
//# sourceMappingURL=files.service.js.map