import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import swaggerConfig from '../../../config/swagger';
import upload from '../../../config/upload';
import swaggerFile from '../../../swagger.json';
import createConnection from '../typeorm';
import { parseErrors } from './middlewares/parseErrors';
import { router } from './routes';
import '../../container';

createConnection();
const app = express();

app.use(express.json());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, swaggerConfig)
);

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(router);
app.use(parseErrors);
app.use(express.static(path.resolve(__dirname, '..', '..', '..', 'public')));

export { app };
