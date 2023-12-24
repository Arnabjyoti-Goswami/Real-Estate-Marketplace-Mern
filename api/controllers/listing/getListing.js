import Listing from '../../models/listing.model.js';
import errorHandler from '../../utils/error.js';

const getListing = async (req, res, next) => {
  const { id: listingId } = req.params;

  try {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return next(errorHandler(400, 'Listing not found!'));
    }

    res.status(200).json(listing);

  } catch (error) {
    next(error);
  }
};

export default getListing;