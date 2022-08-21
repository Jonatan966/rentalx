import fs from 'fs/promises';
import path from 'path';

import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { ImportCategoryUseCase } from './ImportCategoryUseCase';

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
let importCategoryUseCase: ImportCategoryUseCase;

const csvFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '__mocks__',
  'import-category.csv'
);

const tempFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'tmp',
  'import-category.csv'
);

describe('Import Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    importCategoryUseCase = new ImportCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it('should be able to import a new category', async () => {
    await fs.copyFile(csvFilePath, tempFilePath);

    const importedCategories = await importCategoryUseCase.execute({
      originalname: 'import-category.csv',
      mimetype: 'text/csv',
      path: tempFilePath,
    } as Express.Multer.File);

    expect(importedCategories).toHaveLength(3);
  });

  it('should not be able to duplicate categories', async () => {
    await fs.copyFile(csvFilePath, tempFilePath);

    await importCategoryUseCase.execute({
      originalname: 'import-category.csv',
      mimetype: 'text/csv',
      path: tempFilePath,
    } as Express.Multer.File);

    await fs.copyFile(csvFilePath, tempFilePath);

    const importedCategories = await importCategoryUseCase.execute({
      originalname: 'import-category.csv',
      mimetype: 'text/csv',
      path: tempFilePath,
    } as Express.Multer.File);

    expect(importedCategories).toHaveLength(0);
  });
});
