import Listing from '@models/listingModel';
import asyncHandler from '@utils/asyncWrapper';

type QueryParams = {
  limit?: string;
  startIndex?: string;
  furnished?: boolean | 'false';
  offer?: boolean | 'false';
  parking?: boolean | 'false';
  type?: 'all' | 'sale' | 'rent';
  searchTerm?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

type BooleanQuery = boolean | string | undefined | { $in: [boolean, boolean] };

type SaleRentQuery = 'all' | 'sale' | 'rent' | undefined | { $in: ['sale', 'rent'] };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getListings = asyncHandler(async (req, res, next) => {
  const queryParams: QueryParams = req.query;

  let limit: number = 9;
  if (typeof queryParams.limit === 'string') {
    limit = parseInt(queryParams.limit, 10);
  }

  let startIndex: number = 0;
  if (typeof queryParams.startIndex === 'string') {
    startIndex = parseInt(queryParams.startIndex, 10);
  }

  let furnished: BooleanQuery = queryParams.furnished;
  if (furnished === undefined || furnished === 'false') {
    furnished = { $in: [false, true] };
  }

  let offer: BooleanQuery = queryParams.offer;
  if (offer === undefined || offer === 'false') {
    offer = { $in: [false, true] };
  }

  let parking: BooleanQuery = queryParams.parking;
  if (parking === undefined || parking === 'false') {
    parking = { $in: [false, true] };
  }

  let type: SaleRentQuery = queryParams.type;
  if (type === undefined || type === 'all') {
    type = { $in: ['sale', 'rent'] };
  }

  const searchTerm: string = queryParams.searchTerm || '';

  const sort: string = queryParams.sort || 'createdAt';

  const order: 'asc' | 'desc' = queryParams.order || 'desc';

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: 'i' },
    offer,
    furnished,
    parking,
    type,
  })
  .sort({ [sort]: order })
  .limit(limit)
  .skip(startIndex);

  res.status(200).json(listings);

});

export default getListings;
