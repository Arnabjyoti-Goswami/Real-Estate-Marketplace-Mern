import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SwiperComponent from '@/components/SwiperComponent';
import ListingCard from '@/components/ListingCard';
import { ListingsSchema } from '@/zod-schemas/apiSchemas';
import { useQuery } from '@tanstack/react-query';
import { getApi } from '@/apiCalls/fetchHook';

const Home = () => {
  const [swiperList, setSwiperList] = useState<string[]>([]);

  const {
    data: offerListings,
    isSuccess: isSuccessOfferListings,
    error: errorOfferListings,
    isError: isErrorOfferListings,
  } = useQuery({
    queryKey: ['4offerListings'],
    queryFn: async () => {
      const url = '/api/listing/get?offer=true&limit=4' as const;
      const data = await getApi(url);
      const parse = ListingsSchema.parse(data);
      return parse;
    },
  });
  const {
    data: rentListings,
    error: errorRentListings,
    isError: isErrorRentListings,
  } = useQuery({
    queryKey: ['4rentListings'],
    queryFn: async () => {
      const url = '/api/listing/get?type=rent&limit=4' as const;
      const data = await getApi(url);
      const parse = ListingsSchema.parse(data);
      return parse;
    },
    enabled: !!offerListings,
  });
  const {
    data: saleListings,
    error: errorSaleListings,
    isError: isErrorSaleListings,
  } = useQuery({
    queryKey: ['4saleListings'],
    queryFn: async () => {
      const url = '/api/listing/get?type=sale&limit=4' as const;
      const data = await getApi(url);
      const parse = ListingsSchema.parse(data);
      return parse;
    },
    enabled: !!rentListings,
  });
  const fetch = () => {
    if (isErrorOfferListings) {
      console.log(errorOfferListings.message);
    }
    if (isErrorRentListings) {
      console.log(errorRentListings.message);
    }
    if (isErrorSaleListings) {
      console.log(errorSaleListings.message);
    }
    if (isSuccessOfferListings) {
      const fetchedSwiperList = offerListings.map((listing) => {
        return listing.imageUrls[0];
      });
      setSwiperList(fetchedSwiperList);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  console.log(swiperList);

  return (
    <div>
      <div
        className='flex flex-col gap-6 py-28 px-3 mx-auto
      max-w-6xl'
      >
        <h1
          className='text-slate-700 font-bold text-3xl
        lg:text-6xl'
        >
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div
          className='text-gray-400 text-xs
        sm:text-sm'
        >
          Riyal Estate is the best place to find your next home.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to='/search'
          className='text-xs text-blue-800 font-bold
        hover:underline sm:text-sm'
        >
          Let's get started...
        </Link>
      </div>
      {swiperList && swiperList.length > 0 && (
        <SwiperComponent
          listToMap={swiperList}
          keyDownElement='swiper'
          classNames='h-[500px]'
        />
      )}
      <div
        className='max-w-6xl mx-auto p-3 my-10
      flex flex-col gap-8'
      >
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent Offers
              </h2>
              <Link
                to='/search?offer=true'
                className='text-sm text-blue-800 hover:underline'
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for rent
              </h2>
              <Link
                to='/search?type=rent'
                className='text-sm text-blue-800 hover:underline'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for sale
              </h2>
              <Link
                to='/search?offer=true'
                className='text-sm text-blue-800 hover:underline'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
