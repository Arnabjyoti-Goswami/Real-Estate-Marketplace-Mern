import dotenv from 'dotenv';
dotenv.config();
const mongo_admin_url=`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${process.env.CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

