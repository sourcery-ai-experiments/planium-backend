import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class SesService {
  private ses: SESClient;

  constructor(private readonly configService: ConfigService) {
    this.ses = new SESClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      const sender = this.configService.get('AWS_SES_SENDER_EMAIL');

      const command = new SendEmailCommand({
        Source: sender,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Text: {
              Data: body,
            },
          },
        },
      });

      await this.ses.send(command);
    } catch (error) {
      throw new Error(error);
    }
  }
}
