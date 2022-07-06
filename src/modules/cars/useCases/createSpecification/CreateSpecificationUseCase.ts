import { inject, injectable } from 'tsyringe';

import { ISpecificationsRepository } from '../../repositories/contracts/ISpecificationsRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository
  ) {}

  execute({ name, description }: IRequest) {
    const specificationAlreadyExists =
      this.specificationsRepository.findByName(name);

    if (specificationAlreadyExists) {
      throw new Error('Specification already exists');
    }

    const createdSpecification = this.specificationsRepository.create({
      name,
      description,
    });

    return createdSpecification;
  }
}

export { CreateSpecificationUseCase };
