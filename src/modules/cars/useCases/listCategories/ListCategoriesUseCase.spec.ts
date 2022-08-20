import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';

let categoriesRepository: CategoriesRepositoryInMemory;
let listCategoriesUseCase: ListCategoriesUseCase;

describe('List Categories', () => {
  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository);
  });

  it('should be able to list categories', async () => {
    const category = await categoriesRepository.create({
      name: 'Category',
      description: 'A new category',
    });

    const categories = await listCategoriesUseCase.execute();

    expect(categories).toHaveLength(1);
    expect(categories).toStrictEqual([category]);
  });
});
