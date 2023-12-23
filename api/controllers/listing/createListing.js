import Listing from '../../models/listing.model.js';

const createListing = async (req, res, next) => {
  const userId = req.userId;

  try {
    const listing = await Listing.create({
      userRef: userId,
      ...req.body,
    });
    
    res.status(201).json(listing);

  } catch (error) {
    next(error);
  }
};

export default createListing;