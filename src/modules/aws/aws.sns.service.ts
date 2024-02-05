import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SnsService {
  private sns: SNSClient;

  constructor(private readonly configService: ConfigService) {
    this.sns = new SNSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async publishSmsToPhone(phone: string, message: string) {
    try {
      const command = new PublishCommand({
        PhoneNumber: phone,
        Message: message,
      });

      await this.sns.send(command);
    } catch (error) {
      throw new Error(error);
    }
  }
}
