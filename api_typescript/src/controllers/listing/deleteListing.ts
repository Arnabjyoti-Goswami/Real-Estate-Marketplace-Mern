import Listing from '@models/listingModel';
import asyncHandler from '@utils/asyncWrapper';
import errorHandler from '@utils/errorHandler';

type reqBody = {
  userId: string,
}

const deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  const { userId } : reqBody = req.body;
  if (userId !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  await Listing.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Listing has been deleted!',
  });

});

export default deleteListing;