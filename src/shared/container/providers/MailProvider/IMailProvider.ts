interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: Record<string, string>,
    templatePath: string
  ): Promise<void>;
}

export { IMailProvider };
