import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { generalErrorHandler } from './middlewares/general-error.middleware';
import { userRouter, adminRouter, shopRouter } from './routes/app.routes';
import { PUBLIC_PATH } from './configs/app.configs';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    skip: function (_, res) {
      return res.statusCode < 400;
    },
  }),
);
app.use(express.static(PUBLIC_PATH));
app.use(userRouter);
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);

app.use(generalErrorHandler);

export default app;
