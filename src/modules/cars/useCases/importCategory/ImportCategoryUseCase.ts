import { parse as csvParse } from 'csv-parse';
import fs from 'fs';
import { Category } from 'modules/cars/models/Category';
import { ICategoriesRepository } from 'modules/cars/repositories/contracts/ICategoriesRepository';

interface IImportCategory {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const parseFile = csvParse();
      const categories: IImportCategory[] = [];

      stream.pipe(parseFile);

      parseFile
        .on('data', async ([name, description]: [string, string]) => {
          categories.push({
            name,
            description,
          });
        })
        .on('end', () => resolve(categories))
        .on('error', (error) => reject(error));
    });
  }

  async execute(file: Express.Multer.File): Promise<Category[]> {
    const categories = await this.loadCategories(file);
    const createdCategories: Category[] = [];

    categories.forEach((category) => {
      const { name, description } = category;

      const categoryAlreadyExists = this.categoriesRepository.findByName(name);

      if (!categoryAlreadyExists) {
        const createdCategory = this.categoriesRepository.create({
          name,
          description,
        });

        createdCategories.push(createdCategory);
      }
    });

    return createdCategories;
  }
}

export { ImportCategoryUseCase };
