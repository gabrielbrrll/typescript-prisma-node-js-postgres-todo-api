import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';

import config from '../config/config';
import logger from '../config/logger.config';

export const errorHandler: ErrorRequestHandler = (err, _, res) => {
  let { statusCode = 500, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};