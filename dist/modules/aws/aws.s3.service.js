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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.s3 = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    async uploadFile(key, body) {
        try {
            const bucket = this.configService.get('AWS_S3_BUCKET_NAME');
            const region = this.configService.get('AWS_REGION');
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
            });
            await this.s3.send(command);
            const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
            return fileUrl;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error uploading file to S3: ${error}`);
        }
    }
    async deleteFile(key) {
        try {
            const bucket = this.configService.get('AWS_S3_BUCKET_NAME');
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            await this.s3.send(command);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error deleting file from S3: ${error}`);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=aws.s3.service.js.map