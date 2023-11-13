import express from 'express';
import signup from '../controllers/auth/signup.js';
import signin from '../controllers/auth/signin.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

export default router;