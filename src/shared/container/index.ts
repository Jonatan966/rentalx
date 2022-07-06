import { container } from 'tsyringe';

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
