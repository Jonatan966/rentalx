import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProfileUserUseCase } from './ProfileUserUseCase';

class ProfileUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const profileUserUseCase = container.resolve(ProfileUserUseCase);

    const user = await profileUserUseCase.execute(request.user.id);

    return response.json(user);
  }
}

export { ProfileUserController };
