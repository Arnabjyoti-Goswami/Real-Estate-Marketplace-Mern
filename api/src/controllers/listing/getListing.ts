import Listing from '@models/listingModel';
import asyncHandler from '@utils/asyncWrapper';
import errorHandler from '@utils/errorHandler';

const getListing = asyncHandler(async (req, res, next) => {
  const listingId = req.params.id;

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return next(errorHandler(400, 'Listing not found!'));
  }

  res.status(200).json(listing);

});

export default getListing;