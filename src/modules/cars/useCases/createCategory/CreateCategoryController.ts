import { Request, Response } from 'express';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  handle(request: Request, response: Response): Response {
    const { name, description } = request.body;

    const createdCategory = this.createCategoryUseCase.execute({
      name,
      description,
    });

    return response.status(201).json(createdCategory);
  }
}

export { CreateCategoryController };
