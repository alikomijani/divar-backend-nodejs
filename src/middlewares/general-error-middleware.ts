import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function generalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ errors: [{ message: 'Something went wrong' }] });
}
