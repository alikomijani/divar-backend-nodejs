import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';

import { generalErrorHandler } from './middlewares/general-error-middleware';
import usersRouter from './users/users.routes';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', usersRouter);
app.use(
  morgan('combined', {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  }),
);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});
app.use(generalErrorHandler);
export default app;
