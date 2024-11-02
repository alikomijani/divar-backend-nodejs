import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
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
app.use(cookieParser());

app.use('/auth', usersRouter);
app.use(
  morgan('combined', {
    skip: function (_, res) {
      return res.statusCode < 400;
    },
  }),
);
app.get('/', (_: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});
app.use(generalErrorHandler);
export default app;
