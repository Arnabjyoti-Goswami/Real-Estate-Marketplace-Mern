import express from 'express';
import signup from '@controllers/auth/signup';
import signin from '@controllers/auth/signin';
import googleSignin from '@controllers/auth/googleSignin';
import signout from '@controllers/auth/signout';
import forgotPassword from '@controllers/auth/forgotPassword';
import resetPassword from '@controllers/auth/resetPassword';
import verifyRefreshToken from '@controllers/auth/refreshToken';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', googleSignin);
router.get('/signout', signout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/refresh-token', verifyRefreshToken);

export default router;