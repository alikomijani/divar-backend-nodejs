import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function generalErrorHandler(err: Error, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    success: false,
    errors: [{ message: 'Something went wrong' }],
  });
}
