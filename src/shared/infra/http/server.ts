import 'reflect-metadata';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express from 'express';
import 'express-async-errors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import swaggerConfig from '../../../config/swagger';
import upload from '../../../config/upload';
import swaggerFile from '../../../swagger.json';
import createConnection from '../typeorm';
import { parseErrors } from './middlewares/parseErrors';
import rateLimiter from './middlewares/rateLimiter';
import { router } from './routes';
import '../../container';

createConnection();
const app = express();
const isProduction = process.env.NODE_ENV === 'prod';

app.use(rateLimiter);

if (isProduction) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, swaggerConfig)
);

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(router);

if (isProduction) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(parseErrors);
app.use(express.static(path.resolve(__dirname, '..', '..', '..', 'public')));

export { app };
