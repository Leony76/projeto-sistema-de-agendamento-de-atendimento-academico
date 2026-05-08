import type {
  Request,
  Response,
  NextFunction,
} from 'express';
import { ApiError } from '@backend/utils/apiError.util';

export const apiErrorMiddleware = (
  error    : Error,
  request  : Request,
  response : Response,
  next     : NextFunction,
) => {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
};