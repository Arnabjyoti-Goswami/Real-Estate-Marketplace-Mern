import { initializeApp } from 'firebase/app';

import env from '@/validateEnv';

const apiKey = env.VITE_FIREBASE_API_KEY;
const messagingSenderId = env.VITE_FIREBASE_MESSAGE_SENDER_ID;
const appId = env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain: 'mern-estate-70c92.firebaseapp.com',
  projectId: 'mern-estate-70c92',
  storageBucket: 'mern-estate-70c92.appspot.com',
  messagingSenderId,
  appId,
};

export const app = initializeApp(firebaseConfig);
