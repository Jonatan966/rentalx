import { AppError } from '../../../../shared/errors/AppError';
import { CarsRepositoryInMemory } from '../../repositories/in-memory/CarsRepositoryInMemory';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(
      carsRepositoryInMemory,
      categoriesRepositoryInMemory
    );
  });

  it('should be able to create a new car', async () => {
    const category = await categoriesRepositoryInMemory.create({
      name: 'New category',
      description: 'description',
    });

    const car = await createCarUseCase.execute({
      name: 'Fake Car',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: category.id,
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car with a non-existing category', async () => {
    await expect(
      createCarUseCase.execute({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'BOM-1234',
        fine_amount: 60,
        brand: 'brand',
        category_id: 'non-existing-category',
      })
    ).rejects.toEqual(new AppError('Category does not exists'));
  });

  it('should not be able to create a car with exists license plate', async () => {
    const category = await categoriesRepositoryInMemory.create({
      name: 'New category',
      description: 'description',
    });

    await createCarUseCase.execute({
      name: 'Fake Car 1',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: category.id,
    });

    await expect(
      createCarUseCase.execute({
        name: 'Fake Car 2',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'brand',
        category_id: category.id,
      })
    ).rejects.toEqual(new AppError('Car already exists'));
  });

  it('should not be able to create a car with available true by default', async () => {
    const category = await categoriesRepositoryInMemory.create({
      name: 'New category',
      description: 'description',
    });

    const car = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'Fake description',
      daily_rate: 100,
      license_plate: 'ABCD-1234',
      fine_amount: 60,
      brand: 'brand',
      category_id: category.id,
    });

    expect(car).toHaveProperty('available', true);
  });
});
