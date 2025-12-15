import { Injectable } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private client: MailtrapClient;

  constructor() {
    this.client = new MailtrapClient({
      token: process.env.MAILTRAP_API_KEY!,
    });
  }

  async sendMail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: {
      name: string;
      email: string;
    };
  }) {
    const {
      to,
      subject,
      text,
      html,
      from = {
        name: 'My App',
        email: 'no-reply@myapp.com',
      },
    } = options;

    return this.client.send({
      from,
      to: Array.isArray(to)
        ? to.map((email) => ({ email }))
        : [{ email: to }],
      subject,
      text,
      html,
    });
  }
}
