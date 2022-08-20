import { deleteFile } from '../../../../utils/file';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

jest.mock('../../../../utils/file', () => ({
  deleteFile: jest.fn(),
}));

describe('Upload user avatar', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      usersRepositoryInMemory
    );
  });

  it('should be able to upload a user avatar', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: 'fake user 1',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '1234-ABCD',
    });

    expect(createdUser.avatar).toBeUndefined();

    const updatedUser = await updateUserAvatarUseCase.execute({
      user_id: createdUser.id,
      avatar_file: 'new-image.png',
    });

    expect(updatedUser).toHaveProperty('avatar', 'new-image.png');
  });

  it('should be able to delete old user avatar', async () => {
    const createdUser = await usersRepositoryInMemory.create({
      name: 'fake user 1',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '1234-ABCD',
    });

    await updateUserAvatarUseCase.execute({
      user_id: createdUser.id,
      avatar_file: 'new-image.png',
    });

    await updateUserAvatarUseCase.execute({
      user_id: createdUser.id,
      avatar_file: 'new-image2.png',
    });

    expect(deleteFile).toHaveBeenCalledTimes(1);
  });
});
