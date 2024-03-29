import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

import authRouter from '@routes/authRoutes';
app.use('/api/auth', authRouter);

import userRouter from '@routes/userRoutes';
app.use('/api/user', userRouter);

import listingRouter from '@routes/listingRoutes';
app.use('/api/listing', listingRouter);

// Error middleware
import { Request, Response, NextFunction } from 'express';
import CustomError from '@utils/customError';

app.use((err: CustomError, req: Request, res: Response, _: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error!';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
