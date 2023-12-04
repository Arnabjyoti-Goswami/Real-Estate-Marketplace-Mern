import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import updateUser from '../controllers/user/updateUser.js';
import deleteUser from '../controllers/user/deleteUser.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;