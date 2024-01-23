import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import SwiperComponent from '@/components/SwiperComponent';
import ListingCard from '@/components/ListingCard';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [swiperList, setSwiperList] = useState([]);

  const fetchOfferListings = async () => {
    try {
      const res = await fetch('/api/listing/get?offer=true&limit=4');
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setOfferListings(data);

      const fetchedSwiperList = data.map((listing) => {
        return listing.imageUrls[0];
      });
      setSwiperList(fetchedSwiperList);

      fetchRentListings();
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchRentListings = async () => {
    try {
      const res = await fetch('/api/listing/get?type=rent&limit=4');
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setRentListings(data);
      fetchSaleListings();
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const res = await fetch('/api/listing/get?type=sale&limit=4');
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setSaleListings(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchOfferListings();
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
