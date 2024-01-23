import Listing from '@models/listingModel';
import asyncHandler from '@utils/asyncWrapper';

type reqBody = {
  userId: string,
  imageUrls: [string],
  name: string,
  description: string,
  address: string,
  type: 'rent' | 'sale',
  bedrooms: number,
  bathrooms: number,
  regularPrice: number,
  discountPrice: number,
  offer: boolean,
  parking: boolean,
  furnished: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createListing = asyncHandler(async (req, res, next) => {
  const { 
    userId,
    ...listingData
  }: reqBody = req.body;

  const listing = await Listing.create({
    userRef: userId,
    listingData,
  });

  res.status(201).json(listing);

});

export default createListing;