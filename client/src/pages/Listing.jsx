import { useLayoutEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

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
      console.log(listingData);

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
    {
    isLoading && (
    <p className='text-center my-7 text-2xl'>
      Loading...
    </p> 
    )
    }
    {
    error && (
    <p className='text-center my-7 text-2xl'>
      {error}
    </p>
    )
    }
    {
    (objectExists(listingData) && !error && !isLoading) && (
    <>
    <Swiper navigation ref={swiperRef}>
    {
    listingData.imageUrls.map( (imageUrl, index) => (
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
    </>
    )
    }
    </main>
  );
};

export default Listing;