import app from '@src/app';
import env from '@utils/validateEnv';

import mongoose from 'mongoose';

const mongo_admin_url = `mongodb+srv://${env.USER_NAME}:${env.USER_PASSWORD}@${env.CLUSTER}.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongo_admin_url)
  .then(() => {
    console.log('Connected to MongoDB via mongoose.');
    app.listen(env.PORT, '0.0.0.0', () => {
      const startTime = new Date().toLocaleString();
      console.log('Server started at: ' + startTime);
      console.log('Server running on port: ' + env.PORT);
    });
  })
  .catch(console.error);
