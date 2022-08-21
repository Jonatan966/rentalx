import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

class ListSpecificationsController {
  async handle(_: Request, response: Response): Promise<Response> {
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUseCase
    );

    const specifications = await listSpecificationsUseCase.execute();

    return response.json(specifications);
  }
}

export { ListSpecificationsController };
