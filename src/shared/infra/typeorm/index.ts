import { DataSource } from 'typeorm';

import { User } from '../../../modules/accounts/infra/typeorm/entities/User';
import { UserTokens } from '../../../modules/accounts/infra/typeorm/entities/UserTokens';
import { Car } from '../../../modules/cars/infra/typeorm/entities/Car';
import { CarImage } from '../../../modules/cars/infra/typeorm/entities/CarImage';
import { Category } from '../../../modules/cars/infra/typeorm/entities/Category';
import { Specification } from '../../../modules/cars/infra/typeorm/entities/Specification';
import { Rental } from '../../../modules/rentals/infra/typeorm/entities/Rental';
import { CreateCategories1657067683950 } from './migrations/1657067683950-CreateCategories';
import { CreateSpecifications1657071988927 } from './migrations/1657071988927-CreateSpecifications';
import { CreateUsers1657240184285 } from './migrations/1657240184285-CreateUsers';
import { AlterUserDeleteUsername1657243139564 } from './migrations/1657243139564-AlterUserDeleteUsername';
import { CreateCars1659899768040 } from './migrations/1659899768040-CreateCars';
import { CreateSpecificationCars1660180910693 } from './migrations/1660180910693-CreateSpecificationCars';
import { CreateCarImages1660486004661 } from './migrations/1660486004661-CreateCarImages';
import { CreateRentals1660487479947 } from './migrations/1660487479947-CreateRentals';
import { CreateUsersToken1661993020146 } from './migrations/1661993020146-CreateUsersToken';

const dataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  host: 'localhost',
  username: 'docker',
  password: 'ignite',
  database: process.env.NODE_ENV === 'test' ? 'rentx_test' : 'rentx',
  entities: [
    Category,
    Specification,
    User,
    Car,
    Specification,
    CarImage,
    Rental,
    UserTokens,
  ],
  migrations: [
    CreateCategories1657067683950,
    CreateSpecifications1657071988927,
    CreateUsers1657240184285,
    AlterUserDeleteUsername1657243139564,
    CreateCars1659899768040,
    CreateSpecificationCars1660180910693,
    CreateCarImages1660486004661,
    CreateRentals1660487479947,
    CreateUsersToken1661993020146,
  ],
});

export function createConnection(host = 'database'): Promise<DataSource> {
  return dataSource.setOptions({ host }).initialize();
}

export default dataSource;
