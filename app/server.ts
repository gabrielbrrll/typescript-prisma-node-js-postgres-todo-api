import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';

import xss from '../middleware/xss';
import userRoutes from '../routes/user.routes';
import todoRoutes from '../routes/task.routes';
import passportConfig from '../config/passport.config';
import ApiError from '../utils/ApiError';
import { errorHandler } from '../middleware/errors';

const createServer = () => {
  const app = express();

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // sanitize request data
  app.use(xss());

  // gzip compression
  app.use(compression());

  // enable cors
  app.use(cors());
  app.options('*', cors());

  app.use(passportConfig.initialize());

  // v1 api routes
  app.use('/v1/users', userRoutes);
  app.use('/v1/tasks', todoRoutes);

  // send back a 404 error for any unknown api request
  app.use((_, __, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // handle error
  app.use(errorHandler);

  return app;
};

export default createServer;
