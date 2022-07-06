import { Category } from '../../entities/Category';

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  create({ name, description }: ICreateCategoryDTO): Promise<Category>;

  list(): Promise<Category[]>;

  findByName(name: string): Promise<Category | undefined>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
