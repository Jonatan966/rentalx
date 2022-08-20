import { CarImagesRepositoryInMemory } from '../../repositories/in-memory/CarImagesRepositoryInMemory';
import { UploadCarImagesUseCase } from './UploadCarImageUseCase';

let carImagesRepositoryInMemory: CarImagesRepositoryInMemory;
let uploadCarImagesUseCase: UploadCarImagesUseCase;

describe('Upload car image', () => {
  beforeEach(() => {
    carImagesRepositoryInMemory = new CarImagesRepositoryInMemory();
    uploadCarImagesUseCase = new UploadCarImagesUseCase(
      carImagesRepositoryInMemory
    );
  });

  it('should be able to create a new car images', async () => {
    const carImages = await uploadCarImagesUseCase.execute({
      car_id: 'car-123',
      images_name: ['image-1', 'image-2'],
    });

    expect(carImages).toHaveLength(2);
    expect(carImages[0]).toHaveProperty('image_name', 'image-1');
    expect(carImages[1]).toHaveProperty('image_name', 'image-2');
  });
});
