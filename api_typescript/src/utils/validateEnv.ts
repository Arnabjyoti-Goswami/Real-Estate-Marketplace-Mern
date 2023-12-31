import { cleanEnv } from 'envalid';
import { 
  str, 
  port, 
  num, 
  email, 
  url,
} from 'envalid/dist/validators';

export default cleanEnv(process.env, {
  DB_NAME: str(),
  USER_NAME: str(),
  USER_PASSWORD: str(),
  CLUSTER: str(),
  PORT: port(),
  NUM_SALT: num(),
  JWT_SECRET_KEY: str(),
  JWT_SECRET_KEY_2: str(),
  ACCESS_TOKEN_LIFE: str(),
  REFRESH_TOKEN_LIFE: str(),
  JWT_RESET_PASSWORD_SECRET_KEY: str(),
  EMAIL: email(),
  FRONTEND_URL: url(),
  CLIENT_SECRET: str(),
  CLIENT_ID: str(),
  REFRESH_TOKEN: str(),
});