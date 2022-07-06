import { Specification } from '../entities/Specification';
import {
  ISpecificationDTO,
  ISpecificationsRepository,
} from './contracts/ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[];

  constructor() {
    this.specifications = [];
  }

  create({ description, name }: ISpecificationDTO): Specification {
    const specification = new Specification();

    Object.assign(specification, {
      description,
      name,
      created_at: new Date(),
    });

    this.specifications.push(specification);

    return specification;
  }

  findByName(name: string): Specification {
    const specification = this.specifications.find(
      (specification) => specification.name === name
    );

    return specification;
  }
}

export { SpecificationsRepository };
