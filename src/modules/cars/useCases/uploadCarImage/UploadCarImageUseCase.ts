import { inject, injectable } from 'tsyringe';

import { ICarImagesRepository } from '../../repositories/ICarImagesRepository';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository
  ) {}

  async execute({ car_id, images_name }: IRequest) {
    const createdCarImages = await Promise.all(
      images_name.map(async (image) => {
        const carImage = await this.carImagesRepository.create(car_id, image);

        return carImage;
      })
    );

    return createdCarImages;
  }
}

export { UploadCarImagesUseCase };
