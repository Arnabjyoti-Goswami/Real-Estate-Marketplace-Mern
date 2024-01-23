import express from 'express';
import verifyToken from '@utils/verifyToken';
import updateUser from '@controllers/user/updateUser';
import deleteUser from '@controllers/user/deleteUser';
import getUserListings from '@controllers/user/getUserListings';
import getUser from '@controllers/user/getUser';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

export default router;