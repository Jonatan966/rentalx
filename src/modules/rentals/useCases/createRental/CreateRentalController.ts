import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from './CreateRentalUseCase';

class CreateRentalController {
  async handle(request: Request, response: Response) {
    const { expected_return_date, car_id } = request.body;

    const createRentalUseCase = container.resolve(CreateRentalUseCase);

    const rental = await createRentalUseCase.execute({
      expected_return_date,
      car_id,
      user_id: request.user.id,
    });

    return response.status(201).json(rental);
  }
}

export { CreateRentalController };
