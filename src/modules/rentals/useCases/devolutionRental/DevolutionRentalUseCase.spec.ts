import { v4 as uuidv4 } from 'uuid';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { CarsRepositoryInMemory } from '../../../cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: IDateProvider;
let devolutionRentalUseCase: DevolutionRentalUseCase;

describe('Devolution Rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    devolutionRentalUseCase = new DevolutionRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });

  it('should be able to return car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fake Car',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: 'the-category',
    });

    const rental = await rentalsRepositoryInMemory.create({
      car_id: car.id,
      expected_return_date: dateProvider.addDays(1),
      user_id: 'the-user',
    });

    expect(rental).not.toHaveProperty('end_date');

    const devolutionResult = await devolutionRentalUseCase.execute({
      rental_id: rental.id,
      user_id: 'the-user',
    });

    expect(devolutionResult).toHaveProperty('end_date');
    expect(devolutionResult).toHaveProperty('total', 160);
  });

  it('should not be able to return car with inexistent rental', async () => {
    await expect(
      devolutionRentalUseCase.execute({
        rental_id: uuidv4(),
        user_id: 'the-user',
      })
    ).rejects.toEqual(new AppError('Rental does not exists'));
  });

  it('should not be able to return car of another user', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fake Car',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: 'the-category',
    });

    const rental = await rentalsRepositoryInMemory.create({
      car_id: car.id,
      expected_return_date: dateProvider.addDays(1),
      user_id: 'user-one',
    });

    await expect(
      devolutionRentalUseCase.execute({
        rental_id: rental.id,
        user_id: 'another-user',
      })
    ).rejects.toEqual(new AppError('Rental does not exists'));
  });

  it('should be able to return car after 2 days of rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fake Car',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: 'the-category',
    });

    const rental = await rentalsRepositoryInMemory.create({
      car_id: car.id,
      expected_return_date: dateProvider.addDays(2),
      user_id: 'the-user',
    });

    const devolutionResult = await devolutionRentalUseCase.execute({
      rental_id: rental.id,
      user_id: 'the-user',
    });

    expect(devolutionResult).toHaveProperty('total', 220);
  });
});
