import express from 'express';

import verifyToken from '../utils/verifyToken.js';
import createListing from '../controllers/listing/createListing.js';
import deleteListing from '../controllers/listing/deleteListing.js';
import updateListing from '../controllers/listing/updateListing.js';
import getListing from '../controllers/listing/getListing.js';
import getListings from '../controllers/listing/getListings.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;