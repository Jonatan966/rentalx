import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '../../../dtos/ICreateCarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
    });

    await this.repository.save(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ where: { license_plate } });

    return car;
  }

  async listAvailable(
    category_id?: string,
    name?: string,
    brand?: string
  ): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder('car')
      .where('car.available = :available', { available: true });

    if (category_id) {
      carsQuery.andWhere('car.category_id = :category_id', { category_id });
    }

    if (name) {
      carsQuery.andWhere('car.name = :name', { name });
    }

    if (brand) {
      carsQuery.andWhere('car.brand = :brand', { brand });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }
}

export { CarsRepository };
