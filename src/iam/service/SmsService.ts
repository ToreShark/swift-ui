import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  async sendSMS(phoneNumber: string, code: number): Promise<void> {
    const token = this.configService.get<string>('SMS_API_TOKEN');
    const smsApiUrl = this.configService.get<string>('SMS_API_URL');

    const messageText = `Ваш код подтверждения: ${code} iColor`;

    const request = {
      messages: [
        {
          recipient: phoneNumber,
          recipientType: 'recipient',
          id: '1234',
          source: 'your-source',
          timeout: 3600,
          shortenUrl: true,
          text: messageText
        }
      ],
      validate: false,
      tags: ['tag1', 'tag2'],
      startDateTime: '2023-12-14 11:13:26',
      timeRange: { start: '00:00:00', stop: '23:59:59' },
      smooth: { stopDateTime: '2023-12-15 11:13:26', stepSeconds: 600 },
      timeZone: 'Europe/Moscow',
      duplicateRecipientsAllowed: false,
      opsosAllowed: ['beeline', 'megafon', 'mts', 'globaltelecom', 'rus_yota', 'tele2'],
      opsosDisallowed: ['operator2'],
      channel: 0,
      transliterate: false
    };

    try {
      await axios.post(smsApiUrl, request, {
        headers: {
          'Content-Type': 'application/json',
          'X-Token': token
        }
      });
    } catch (error) {
      throw new HttpException('Failed to send SMS', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
