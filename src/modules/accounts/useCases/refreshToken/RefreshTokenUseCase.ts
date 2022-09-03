import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '../../../../config/auth';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { UserTokens } from '../../infra/typeorm/entities/UserTokens';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

interface IPayload {
  email: string;
  sub: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayJsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(refreshToken: string): Promise<UserTokens> {
    const { email, sub: user_id } = verify(
      refreshToken,
      auth.secret_refresh_token
    ) as IPayload;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        refreshToken
      );

    if (!userToken) {
      throw new AppError('Refresh token does not exists');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const {
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    const newRefreshToken = sign({ email }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const savedRefreshToken = await this.usersTokensRepository.create({
      expires_date: refreshTokenExpiresDate,
      refresh_token: newRefreshToken,
      user_id,
    });

    return savedRefreshToken;
  }
}

export { RefreshTokenUseCase };
