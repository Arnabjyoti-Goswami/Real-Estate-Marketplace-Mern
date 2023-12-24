import express from 'express';

import verifyToken from '../utils/verifyToken.js';
import createListing from '../controllers/listing/createListing.js';
import deleteListing from '../controllers/listing/deleteListing.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;