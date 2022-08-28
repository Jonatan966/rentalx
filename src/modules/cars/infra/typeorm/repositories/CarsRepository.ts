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
    id,
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      specifications,
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

  async findById(car_id: string): Promise<Car> {
    const car = await this.repository.findOne(car_id);

    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute();
  }
}

export { CarsRepository };
