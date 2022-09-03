import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { IMailProvider } from '../IMailProvider';

class EtherialMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((error) =>
        console.log(
          '[etherial mail provider] error after try to connect',
          error
        )
      );
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

    const message = (await this.client.sendMail({
      to,
      from: 'Rentx <noreply@rentx.com.br>',
      subject,
      html: templateHTML,
    })) as SMTPTransport.SentMessageInfo;

    console.log('Message sent: %s', message.messageId);
    console.log('Message sent: %s', nodemailer.getTestMessageUrl(message));
  }
}

export { EtherialMailProvider };
