// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey: string = import.meta.env.VITE_FIREBASE_API_KEY;
const messagingSenderId: string = import.meta.env
  .VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId: string = import.meta.env.VITE_FIREBASE_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain: 'mern-estate-70c92.firebaseapp.com',
  projectId: 'mern-estate-70c92',
  storageBucket: 'mern-estate-70c92.appspot.com',
  messagingSenderId,
  appId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
