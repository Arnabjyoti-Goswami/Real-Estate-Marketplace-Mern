import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const fetchOfferListings = async () => {
    try {
      const res = await fetch('/api/listing/get?offer=true&limit=4');
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setOfferListings(data);
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

  return (
    <div>
      <div className='flex flex-col gap-6 py-28 px-3 mx-auto
      max-w-6xl'>
        <h1 className='text-slate-700 font-bold text-3xl
        lg:text-6xl'>
          Find your next {' '}
          <span className='text-slate-500'>
            perfect
          </span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs
        sm:text-sm'>
          Riyal Estate is the best place to find your next home.
          <br /> 
          We have a wide range of properties for you to choose from.
        </div>
        <Link to='/search'
        className='text-xs text-blue-800 font-bold
        hover:underline sm:text-sm'>
          Let's get started...
        </Link>
      </div>
    </div>
  );
}

export default Home;
