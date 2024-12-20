import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { generalErrorHandler } from './middlewares/general-error.middleware';
import appRouter from './routes/app.routes';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(appRouter);
app.use(
  morgan('combined', {
    skip: function (_, res) {
      return res.statusCode < 400;
    },
  }),
);

app.get('/', express.static(path.join(__dirname, '../public')));
app.use(generalErrorHandler);

export default app;
