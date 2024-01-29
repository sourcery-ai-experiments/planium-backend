import { ConfigService } from '@nestjs/config';
export declare class SnsService {
    private readonly configService;
    private sns;
    constructor(configService: ConfigService);
    publishSmsToPhone(phone: string, message: string): Promise<void>;
}
