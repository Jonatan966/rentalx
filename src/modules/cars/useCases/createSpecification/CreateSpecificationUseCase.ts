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

  async execute({ name, description }: IRequest) {
    const specificationAlreadyExists =
      await this.specificationsRepository.findByName(name);

    if (specificationAlreadyExists) {
      throw new Error('Specification already exists');
    }

    const createdSpecification = await this.specificationsRepository.create({
      name,
      description,
    });

    return createdSpecification;
  }
}

export { CreateSpecificationUseCase };
