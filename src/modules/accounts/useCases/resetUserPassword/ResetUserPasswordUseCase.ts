import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';

interface IRequest {
  magicToken: string;
  password: string;
}

@injectable()
class ResetUserPasswordUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayJsDateProvider')
    private dateProvider: IDateProvider,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ magicToken, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      magicToken
    );

    if (!userToken) {
      throw new AppError('Invalid token');
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError('Token expired');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };
