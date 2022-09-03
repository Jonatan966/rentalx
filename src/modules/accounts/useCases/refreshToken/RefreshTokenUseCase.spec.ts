import { sign, decode } from 'jsonwebtoken';

import auth from '../../../../config/auth';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { UsersTokensRepositoryInMemory } from '../../repositories/in-memory/UsersTokensRepositoryInMemory';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let dateProvider: IDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let refreshTokenUseCase: RefreshTokenUseCase;

describe('Refresh Token', () => {
  beforeEach(() => {
    dateProvider = new DayJsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepositoryInMemory,
      dateProvider
    );
  });

  it('should be able to refresh token', async () => {
    const refresh_token = sign(
      { email: 'vu@emi.kz' },
      auth.secret_refresh_token,
      {
        subject: '1234',
      }
    );

    const { refresh_token: firstRefreshToken } =
      await usersTokensRepositoryInMemory.create({
        expires_date: dateProvider.addDays(30),
        refresh_token,
        user_id: '1234',
      });

    const newUserToken = await refreshTokenUseCase.execute(firstRefreshToken);

    const decodedNewRefreshToken = decode(newUserToken.refresh_token);

    expect(decodedNewRefreshToken).toHaveProperty('sub', '1234');
    expect(decodedNewRefreshToken).not.toEqual(firstRefreshToken);

    expect(usersTokensRepositoryInMemory.usersTokens.length).toBe(1);
  });

  it('should not be able to refresh with inexistent token', async () => {
    const refresh_token = sign(
      { email: 'ictikib@vorure.tz' },
      auth.secret_refresh_token,
      {
        subject: '4321',
      }
    );

    await expect(refreshTokenUseCase.execute(refresh_token)).rejects.toEqual(
      new AppError('Refresh token does not exists')
    );
  });
});
