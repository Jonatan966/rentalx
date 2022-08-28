import { AppError } from '../../../../shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'fake user',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '1234-ABCD',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user with same e-mail', async () => {
    await createUserUseCase.execute({
      name: 'fake user 1',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '1234-ABCD',
    });

    await expect(
      createUserUseCase.execute({
        name: 'fake user 2',
        email: 'user@email.com',
        password: 'the-password-2',
        driver_license: 'ABCD-1234',
      })
    ).rejects.toEqual(new AppError('User already exists'));
  });
});
