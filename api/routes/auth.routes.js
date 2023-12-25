import express from 'express';
import signup from '../controllers/auth/signup.js';
import signin from '../controllers/auth/signin.js';
import googleSignin from '../controllers/auth/googleSignin.js';
import signout from '../controllers/auth/signout.js';
import forgotPassword from '../controllers/auth/forgotPassword.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleSignin);
router.get('/signout', signout);
router.post('/forgot-password', forgotPassword);

export default router;