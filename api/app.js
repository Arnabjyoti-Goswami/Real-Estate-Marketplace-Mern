import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongo_admin_url=`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${process.env.CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongo_admin_url).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.log(err);
});

import express from 'express';
const app = express();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}); 
