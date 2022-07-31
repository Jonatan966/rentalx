import { Specification } from '../../infra/typeorm/entities/Specification';

interface ISpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create(specification: ISpecificationDTO): Promise<Specification>;
  findByName(name: string): Promise<Specification>;
}

export { ISpecificationsRepository, ISpecificationDTO };
