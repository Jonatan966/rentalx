import { compare } from 'bcrypt';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '../../repositories/in-memory/UsersTokensRepositoryInMemory';
import { ResetUserPasswordUseCase } from './ResetUserPasswordUseCase';

let resetUserPasswordUseCase: ResetUserPasswordUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: IDateProvider;

describe('Reset User Password', () => {
  beforeAll(() => {
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    resetUserPasswordUseCase = new ResetUserPasswordUseCase(
      usersTokensRepositoryInMemory,
      dateProvider,
      usersRepositoryInMemory
    );
  });

  it('should be able to reset user password', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Celia Nash',
      driver_license: '123456',
      email: 'wugwac@carogzaf.md',
      password: 'old-pass',
    });

    const { refresh_token: magicToken } =
      await usersTokensRepositoryInMemory.create({
        expires_date: dateProvider.addDays(3),
        refresh_token: uuidv4(),
        user_id: user.id,
      });

    await resetUserPasswordUseCase.execute({
      magicToken,
      password: 'new-pass',
    });

    const updatedUser = await usersRepositoryInMemory.findById(user.id);

    const hasUpdatedPassword = await compare('new-pass', updatedUser.password);
    expect(hasUpdatedPassword).toBe(true);
  });

  it('should not be able to reset user password with inexistent magic token', async () => {
    await expect(
      resetUserPasswordUseCase.execute({
        magicToken: uuidv4(),
        password: 'new-pass',
      })
    ).rejects.toEqual(new AppError('Invalid token'));
  });

  it('should not be able to reset user password with expired magic token', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Nannie McCarthy',
      driver_license: '654321',
      email: 'zu@duv.za',
      password: 'old-pass',
    });

    const { refresh_token: magicToken } =
      await usersTokensRepositoryInMemory.create({
        expires_date: dayjs().subtract(1, 'day').toDate(),
        refresh_token: uuidv4(),
        user_id: user.id,
      });

    await expect(
      resetUserPasswordUseCase.execute({
        magicToken,
        password: 'new-pass',
      })
    ).rejects.toEqual(new AppError('Token expired'));
  });
});
