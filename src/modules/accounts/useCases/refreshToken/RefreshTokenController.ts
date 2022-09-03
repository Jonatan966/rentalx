import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refresh_token =
      request.query.token ||
      request.headers['x-access-token'] ||
      request.body.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const newRefreshToken = await refreshTokenUseCase.execute(refresh_token);

    return response.json(newRefreshToken);
  }
}

export { RefreshTokenController };
