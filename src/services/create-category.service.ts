import { Category } from '../models/Category';
import { ICategoriesRepository } from '../repositories/contracts/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryService {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute({ name, description }: IRequest): Category {
    const categoryAlreadyExists = this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists) {
      throw new Error('Category already exists');
    }

    const createdCategory = this.categoriesRepository.create({
      name,
      description,
    });

    return createdCategory;
  }
}

export { CreateCategoryService };
