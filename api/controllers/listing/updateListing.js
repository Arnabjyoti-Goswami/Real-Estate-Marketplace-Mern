import Listing from '../../models/listing.model.js';
import errorHandler from '../../utils/error.js';

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.userId !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body, /*if we only provide the fields that need to be updated, it would still work, so {
        userRef: req.userId,
        ...req.body, 
      } is not done here
      */
      { new: true },
    );

    res.status(200).json(updatedListing);

  } catch (error) {
    next(error);
  }
};

export default updateListing;