import { Specification } from '../../entities/Specification';

interface ISpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create(specification: ISpecificationDTO): Specification;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ISpecificationDTO };
