import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());

import authRouter from '@routes/authRoutes';
app.use('/api/auth', authRouter);

import userRouter from '@routes/userRoutes';
app.use('/api/user', userRouter);

import listingRouter from '@routes/listingRoutes';
app.use('/api/listing', listingRouter);

// Error middleware
import { Request, Response, NextFunction } from 'express';
import CustomError from '@utils/customError';

app.use((
  err: CustomError, 
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error!';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;