import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../../errors/AppError';

export async function ensureAdmin(
  request: Request,
  _: Response,
  next: NextFunction
) {
  const { isAdmin } = request.user;

  if (!isAdmin) {
    throw new AppError("User isn't admin", 401);
  }

  next();
}
