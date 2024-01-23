import Listing from '@models/listingModel';
import errorHandler from '@utils/errorHandler';
import asyncHandler from '@utils/asyncWrapper';

type reqBody = {
  userId: string,
  imageUrls?: [string],
  name?: string,
  description?: string,
  address?: string,
  type?: 'rent' | 'sale',
  bedrooms?: number,
  bathrooms?: number,
  regularPrice?: number,
  discountPrice?: number,
  offer?: boolean,
  parking?: boolean,
  furnished?: boolean,
}

const updateListing = asyncHandler(async (req, res, next) => {
  const { userId, ...fieldsToUpdate } : reqBody = req.body;
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(404, 'Listing not found!'));

  if (userId !== listing.userRef) return next(errorHandler(401, 'You can only update your own listings!'));

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    { new: true },
  );

  res.status(200).json(updatedListing);

});

export default updateListing;