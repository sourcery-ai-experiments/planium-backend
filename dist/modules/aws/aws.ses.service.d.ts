import { ConfigService } from '@nestjs/config';
export declare class SesService {
    private readonly configService;
    private ses;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, body: string): Promise<void>;
}
