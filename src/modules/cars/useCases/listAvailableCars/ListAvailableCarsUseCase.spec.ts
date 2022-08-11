import { CarsRepositoryInMemory } from '../../repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Available Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 1',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute();

    expect(cars).toEqual([car]);
  });

  it('should be able to list available cars by name', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car Not Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const carMatch = await carsRepositoryInMemory.create({
      name: 'Car Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car Match',
    });

    expect(cars).toEqual([carMatch]);
  });

  it('should be able to list available cars by brand', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car Not Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const carMatch = await carsRepositoryInMemory.create({
      name: 'Car Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand_match',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_match',
    });

    expect(cars).toEqual([carMatch]);
  });

  it('should be able to list available cars by category', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car Not Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id',
    });

    const carMatch = await carsRepositoryInMemory.create({
      name: 'Car Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category_id_match',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id_match',
    });

    expect(cars).toEqual([carMatch]);
  });

  it('should be able to list available cars by all filters at same time', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car Not Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand_match',
      category_id: 'category_id',
    });

    await carsRepositoryInMemory.create({
      name: 'Car Not Match',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand_not_match',
      category_id: 'category_id_match_all',
    });

    await carsRepositoryInMemory.create({
      name: 'Car Match All',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand_not_match',
      category_id: 'category_id_not_match',
    });

    const carMatch = await carsRepositoryInMemory.create({
      name: 'Car Match All',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'DEF-1234',
      fine_amount: 60,
      brand: 'Car_brand_match',
      category_id: 'category_id_match_all',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id_match_all',
      name: 'Car Match All',
      brand: 'Car_brand_match',
    });

    expect(cars).toEqual([carMatch]);
  });
});
