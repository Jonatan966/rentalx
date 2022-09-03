import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let listRentalsByUserUseCase: ListRentalsByUserUseCase;
let dateProvider: IDateProvider;

describe('List Rentals by User', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(
      rentalsRepositoryInMemory
    );
    dateProvider = new DayJsDateProvider();
  });

  it('should be able to list rentals by user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '1234',
      expected_return_date: dateProvider.addDays(3),
      user_id: 'user-1234',
    });

    const rentals = await listRentalsByUserUseCase.execute('user-1234');

    expect(rentals.length).toBe(1);
  });

  it('should not be able to list rentals of inexistent user', async () => {
    const rentals = await listRentalsByUserUseCase.execute(
      'inexistent-user-id'
    );

    expect(rentals.length).toBe(0);
  });
});
