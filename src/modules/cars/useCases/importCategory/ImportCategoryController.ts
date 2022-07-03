import { Request, Response } from 'express';

import { ImportCategoryUseCase } from './ImportCategoryUseCase';

class ImportCategoryController {
  constructor(private importCategoryUseCase: ImportCategoryUseCase) {}

  async handle(request: Request, response: Response) {
    const importedCategories = await this.importCategoryUseCase.execute(
      request.file
    );

    return response.json({ categories: importedCategories });
  }
}

export { ImportCategoryController };
