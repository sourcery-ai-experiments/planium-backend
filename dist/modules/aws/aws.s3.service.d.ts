/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private s3;
    constructor(configService: ConfigService);
    uploadFile(key: string, body: Buffer): Promise<string>;
    deleteFile(key: string): Promise<void>;
}
