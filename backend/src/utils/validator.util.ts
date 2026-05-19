import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';

import { ApiError } from '@backend/utils/apiError.util';

export function validate(schema: ZodTypeAny) {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(error.issues[0]?.message || 'Erro de validação', 400));
      }

      next(error);
    }
  };
}