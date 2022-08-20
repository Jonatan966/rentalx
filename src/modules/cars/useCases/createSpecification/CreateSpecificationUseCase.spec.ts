import { AppError } from '../../../../shared/errors/AppError';
import { SpecificationsRepositoryInMemory } from '../../repositories/in-memory/SpecificationsRepositoryInMemory';
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe('Create specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory
    );
  });

  it('should be able to create a new specification', async () => {
    const specification = await createSpecificationUseCase.execute({
      name: 'Specification',
      description: 'A new specification',
    });

    expect(specification).toHaveProperty('id');
    expect(specification).toHaveProperty('name', 'Specification');
  });

  it('should not be able to create specification with same name', () => {
    expect(async () => {
      await createSpecificationUseCase.execute({
        name: 'Specification',
        description: 'A new specification 1',
      });

      await createSpecificationUseCase.execute({
        name: 'Specification',
        description: 'A new specification 2',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
