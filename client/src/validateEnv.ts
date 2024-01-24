import { cleanEnv } from 'envalid';
import { str } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
  VITE_FIREBASE_API_KEY: str(),
  VITE_FIREBASE_APP_ID: str(),
  VITE_FIREBASE_MESSAGE_SENDER_ID: str(),
});
