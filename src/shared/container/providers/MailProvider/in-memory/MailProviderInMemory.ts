import { IMailProvider } from '../IMailProvider';

class MailProviderInMemory implements IMailProvider {
  private messages: any[] = [];

  async sendMail(
    to: string,
    subject: string,
    variables: Record<string, string>,
    templatePath: string
  ): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      templatePath,
    });
  }
}

export { MailProviderInMemory };
