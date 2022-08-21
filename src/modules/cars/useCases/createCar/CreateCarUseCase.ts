import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { Car } from '../../infra/typeorm/entities/Car';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      license_plate
    );

    if (carAlreadyExists) {
      throw new AppError('Car already exists');
    }

    const categoryExists = await this.categoriesRepository.findById(
      category_id
    );

    if (!categoryExists) {
      throw new AppError('Category does not exists');
    }

    const createdCar = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    return createdCar;
  }
}

export { CreateCarUseCase };
