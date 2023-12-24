import express from 'express';
import verifyToken from '../utils/verifyToken.js';
import updateUser from '../controllers/user/updateUser.js';
import deleteUser from '../controllers/user/deleteUser.js';
import getUserListings from '../controllers/user/getUserListings.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;