import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetUserPasswordUseCase } from './ResetUserPasswordUseCase';

class ResetUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token: magicToken } = request.query;
    const { password } = request.body;

    const resetUserPasswordUseCase = container.resolve(
      ResetUserPasswordUseCase
    );

    await resetUserPasswordUseCase.execute({
      magicToken: String(magicToken),
      password,
    });

    return response.send();
  }
}

export { ResetUserPasswordController };
