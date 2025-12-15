import { Injectable } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private client: MailtrapClient;

  constructor() {
    this.client = new MailtrapClient({
      token: '15364ac18138847f82c9ef3295c998e6',
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
        name: 'Malokun Labs',
        email: 'no-reply@malokunlabs.com',
      },
    } = options;

    return this.client.send({
      from,
      to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
      subject,
      text,
      html,
    });
  }
}
