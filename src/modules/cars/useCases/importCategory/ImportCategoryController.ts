import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportCategoryUseCase } from './ImportCategoryUseCase';

class ImportCategoryController {
  async handle(request: Request, response: Response) {
    const importCategoryUseCase = container.resolve(ImportCategoryUseCase);

    const importedCategories = await importCategoryUseCase.execute(
      request.file
    );

    return response.status(201).json({ categories: importedCategories });
  }
}

export { ImportCategoryController };
