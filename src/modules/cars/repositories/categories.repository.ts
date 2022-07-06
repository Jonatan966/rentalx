import { getRepository, Repository } from 'typeorm';

import { Category } from '../entities/Category';
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from './contracts/ICategoriesRepository';

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const category = this.repository.create({
      description,
      name,
    });

    await this.repository.save(category);

    return category;
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find();

    return categories;
  }

  async findByName(name: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({
      where: {
        name,
      },
    });

    return category;
  }
}

export { CategoriesRepository };
