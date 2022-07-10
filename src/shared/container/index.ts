import { container } from 'tsyringe';

import { UsersRepository } from '../../modules/accounts/repositories/implementations/UsersRepository';
import { IUsersRepository } from '../../modules/accounts/repositories/IUsersRepository';
import { CategoriesRepository } from '../../modules/cars/repositories/categories.repository';
import { ICategoriesRepository } from '../../modules/cars/repositories/contracts/ICategoriesRepository';
import { ISpecificationsRepository } from '../../modules/cars/repositories/contracts/ISpecificationsRepository';
import { SpecificationsRepository } from '../../modules/cars/repositories/specifications.repository';

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
