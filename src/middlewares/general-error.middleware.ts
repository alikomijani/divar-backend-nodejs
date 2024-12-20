import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function generalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction, // <-- Include this parameter
) {
  console.log(err);
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send standardized error response
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    success: false,
    errors: [{ message: 'Something went wrong' }],
  });
}
