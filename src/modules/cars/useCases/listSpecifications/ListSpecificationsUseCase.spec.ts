import { SpecificationsRepositoryInMemory } from '../../repositories/in-memory/SpecificationsRepositoryInMemory';
import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let listSpecificationsUseCase: ListSpecificationsUseCase;

describe('List specifications', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    listSpecificationsUseCase = new ListSpecificationsUseCase(
      specificationsRepositoryInMemory
    );
  });

  it('should be able to list all specifications', async () => {
    const newSpecification = await specificationsRepositoryInMemory.create({
      name: 'fake specification',
      description: 'fake description',
    });

    const specifications = await listSpecificationsUseCase.execute();

    expect(specifications).toHaveLength(1);
    expect(specifications[0]).toEqual(newSpecification);
  });
});
