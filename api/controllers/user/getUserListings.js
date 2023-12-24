import errorHandler from '../../utils/error.js';
import Listing from '../../models/listing.model.js';

const getUserListings = async (req, res, next) => {
  if (req.userId !== req.params.id) {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
};

export default getUserListings;