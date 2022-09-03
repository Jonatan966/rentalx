import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayJsDateProvider } from './DateProvider/implementations/DayJsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherialMailProvider } from './MailProvider/implementations/EtherialMailProvider';

container.registerSingleton<IDateProvider>(
  'DayJsDateProvider',
  DayJsDateProvider
);

container.registerInstance<IMailProvider>(
  'EtherialMailProvider',
  new EtherialMailProvider()
);
