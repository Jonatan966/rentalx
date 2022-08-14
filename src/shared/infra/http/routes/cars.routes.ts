import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../../../config/upload';
import { CreateCarController } from '../../../../modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '../../../../modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '../../../../modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '../../../../modules/cars/useCases/uploadCarImage/UploadCarImagesController';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

const uploadCarImages = multer(uploadConfig.upload('./tmp/cars'));

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.post(
  '/:id/specifications',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
);

carsRoutes.post(
  '/:id/images',
  ensureAuthenticated,
  ensureAdmin,
  uploadCarImages.array('images'),
  uploadCarImagesController.handle
);

export { carsRoutes };
