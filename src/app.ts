import type { Request, Response } from 'express';
import express from 'express';
import { generalErrorHandler } from './middlewares/general-error-middleware';
import morgan from 'morgan';
import usersRouter from './users/users.routes';

const app = express();

app.use(
  morgan('combined', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);

app.use(express.json());

app.use('/auth', usersRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.use(generalErrorHandler);

export default app;
