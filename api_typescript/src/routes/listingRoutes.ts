import express from 'express';
import verifyToken from '@utils/verifyToken';
import createListing from '@controllers/listing/createListing';
import deleteListing from '@controllers/listing/deleteListing';
import updateListing from '@controllers/listing/updateListing';
import getListing from '@controllers/listing/getListing';
import getListings from '@controllers/listing/getListings';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;