import { Category } from '../../infra/typeorm/entities/Category';
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from '../ICategoriesRepository';

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
    });

    this.categories.push(category);

    return category;
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async findByName(name: string): Promise<Category> {
    const category = this.categories.find((category) => category.name === name);

    return category;
  }

  async findById(id: string): Promise<Category> {
    const category = this.categories.find((category) => category.id === id);

    return category;
  }
}

export { CategoriesRepositoryInMemory };
