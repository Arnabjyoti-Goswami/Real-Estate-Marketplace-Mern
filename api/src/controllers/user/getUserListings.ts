import errorHandler from '@utils/errorHandler';
import Listing from '@models/listingModel';
import asyncHandler from '@utils/asyncWrapper';

type reqBody = {
  userId: string;
};

const getUserListings = asyncHandler(async (req, res, next) => {
  const { userId }: reqBody = req.body;

  if (userId !== req.params.id) {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }

  const listings = await Listing.find({ userRef: req.params.id }).lean();

  res.status(200).json(listings);
});

export default getUserListings;
