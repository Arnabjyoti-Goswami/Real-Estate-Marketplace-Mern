import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from 'react-icons/fa';

import CopyLink from '@/components/CopyLink';
import ContactLandlord from '@/components/ContactLandlord';
import SwiperComponent from '@/components/SwiperComponent';
import { getApi } from '@/apiCalls/fetchHook';
import { ListingSchema } from '@/zod-schemas/apiSchemas';
import type { TListing } from '@/zod-schemas/apiSchemas';

const Listing = () => {
  const { id: idRouteParam } = useParams();

  const fetchListingData = async () => {
    const url = `/api/listing/get/${idRouteParam}` as const;
    const data = await getApi(url);
    const parse = ListingSchema.parse(data);
    return parse;
  };

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchListingData(),
    queryKey: ['ListingPage', idRouteParam],
  });

  const listingData = data as TListing;

  return (
    <main>
      {isLoading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {isError && <p className='text-center my-7 text-2xl'>{error.message}</p>}
      {listingData && (
        <div>
          <SwiperComponent
            listToMap={listingData.imageUrls}
            classNames='h-[550px]'
          />
          <CopyLink />
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listingData.name} - ${' '}
              {listingData.offer
                ? listingData.discountPrice.toLocaleString('en-US')
                : listingData.regularPrice.toLocaleString('en-US')}
              {listingData.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listingData.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listingData.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listingData.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listingData.regularPrice - +listingData.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listingData.description}
            </p>
            <ul
              className='text-green-900 font-semibold text-sm 
        flex flex-wrap items-center 
        gap-4 sm:gap-6'
            >
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listingData.bedrooms > 1
                  ? `${listingData.bedrooms} beds `
                  : `${listingData.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listingData.bathrooms > 1
                  ? `${listingData.bathrooms} baths `
                  : `${listingData.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listingData.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listingData.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            <ContactLandlord listing={listingData} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
