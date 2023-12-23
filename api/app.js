import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const mongo_admin_url=`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${process.env.CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongo_admin_url)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 
app.use(express.json());

import authRouter from './routes/auth.routes.js';
app.use('/api/auth', authRouter);

import userRouter from './routes/user.routes.js';
app.use('/api/user', userRouter);

import listingRouter from './routes/listing.routes.js';
app.use('/api/listing', listingRouter);

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error!';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});