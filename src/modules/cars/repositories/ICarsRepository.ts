import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(car: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  listAvailable(
    category_id?: string,
    name?: string,
    brand?: string
  ): Promise<Car[]>;
  findById(car_id: string): Promise<Car>;
}

export { ICarsRepository };
