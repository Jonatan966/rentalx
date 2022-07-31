import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '../../../swagger.json';
import { parseErrors } from './middlewares/parseErrors';
import { router } from './routes';

import '../typeorm';
import '../../container';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);
app.use(parseErrors);

app.listen(3333, () => console.log('working'));
