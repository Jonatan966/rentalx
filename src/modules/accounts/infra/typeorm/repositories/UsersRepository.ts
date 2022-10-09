import { Repository } from 'typeorm';

import dataSource from '../../../../../shared/infra/typeorm';
import { ICreateUserDTO } from '../../../dtos/ICreateUserDTO';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { User } from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  async create({
    name,
    email,
    driver_license,
    password,
    avatar,
    id,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      driver_license,
      password,
      avatar,
      id,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const findedUser = await this.repository.findOne({
      where: {
        email,
      },
    });

    return findedUser;
  }

  async findById(user_id: string): Promise<User | undefined> {
    const findedUser = await this.repository.findOneBy({ id: user_id });

    return findedUser;
  }
}

export { UsersRepository };
