import { useLayoutEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from 'react-icons/fa';

import CopyLink from '../components/CopyLink.jsx';
import ContactLandlord from '../components/ContactLandlord.jsx';

const Listing = () => {
  SwiperCore.use([Navigation]);

  const { id : idRouteParam } = useParams();

  const [listingData, setListingData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchListingData = async () => {
    try {
      setError('');
      setIsLoading(true);
      const res = await fetch(`/api/listing/get/${idRouteParam}`);
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      setListingData(data);
      setError('');
      setIsLoading(false);

    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const swiperRef = useRef(null);

  const handleKeyDown = (e) => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
  
      if (e.key === 'ArrowLeft') {
        swiperInstance.slidePrev();
      } else if (e.key === 'ArrowRight') {
        swiperInstance.slideNext();
      }
    }
  };

  useLayoutEffect(() => {
    fetchListingData();
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  const objectExists = (obj) => {
    const objectIsEmpty = Object.keys(obj).length === 0;
    return !objectIsEmpty;
  };

  return (
    <main>
    {isLoading && (
    <p className='text-center my-7 text-2xl'>
      Loading...
    </p> 
    )}
    {error && (
    <p className='text-center my-7 text-2xl'>
      {error}
    </p>
    )}
    {(objectExists(listingData) && !error && !isLoading) && (
    <div>
      <Swiper navigation ref={swiperRef}>
      {listingData.imageUrls.map( (imageUrl, index) => (
      <SwiperSlide key={index}>
        <div className='h-[550px]'
        style={{ 
          background: `url(${imageUrl}) center no-repeat`,
          backgroundSize: 'cover',
        }}>
        </div>
      </SwiperSlide>
      ) )
      }
      </Swiper>
      <CopyLink />
      <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
        <p className='text-2xl font-semibold'>
          {listingData.name} - ${' '}
          {listingData.offer
            ? listingData.discountPrice.toLocaleString('en-US')
            : listingData.regularPrice.toLocaleString('en-US')}
          {(listingData.type === 'rent') && ' / month'}
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
          <span className='font-semibold text-black'>
            Description - {' '}
          </span>
          {listingData.description}
        </p>
        <ul className='text-green-900 font-semibold text-sm 
        flex flex-wrap items-center 
        gap-4 sm:gap-6'>
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