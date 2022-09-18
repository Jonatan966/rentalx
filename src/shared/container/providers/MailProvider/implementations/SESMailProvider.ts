import { SES } from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

import { IMailProvider } from '../IMailProvider';

class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: Record<string, string>,
    templatePath: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(templatePath).toString('utf-8');

    const parseTemplate = handlebars.compile(templateFileContent);

    const templateHTML = parseTemplate(variables);

    await this.client.sendMail({
      to,
      from: `Rentx <${process.env.APP_MAIL}>`,
      subject,
      html: templateHTML,
    });
  }
}

export { SESMailProvider };
