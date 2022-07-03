import { Category } from '../../models/Category';

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  create({ name, description }: ICreateCategoryDTO): Category;

  list(): Category[];

  findByName(name: string): Category | undefined;
}

export { ICategoriesRepository, ICreateCategoryDTO };
