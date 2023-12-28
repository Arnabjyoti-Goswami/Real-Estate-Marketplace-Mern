import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const UserListings = () => {
  const { currentUser } = useSelector(state => state.user);
  const [showListings, setShowListings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteListingError, setDeleteListingError] = useState('');
  const [showListingsError, setShowListingsError] = useState('');
  const [userListings, setUserListings] = useState([]);

  const handleShowListing = async () => {
    try {
      setShowListingsError('');
      setLoading(true);

      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(data.message);
        setLoading(false);
        return;
      }

      setUserListings(data);
      setLoading(false);

    } catch (error) {
      setShowListingsError(error.message);
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const navigateToListing = (id) => {
    navigate(`/listing/${id}`);
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
      `/api/listing/delete/${listingId}`,
      {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        setDeleteListingError(data.message);
        return;
      }

      setUserListings((prev) => prev.filter( (listing) => listing._id !== listingId) );

    } catch (error) {
      setDeleteListingError(error.message);
    }
  };

  return (
    <>
    <button className='text-green-700 
    w-[40%] mt-5 ml-[30%] py-3 px-5
    rounded-lg uppercase
    border border-slate-500
    hover:shadow-lg hover:shadow-slate-300 hover:bg-slate-100/40
    whitespace-nowrap font-medium mb-2'
    onClick={() => {
      handleShowListing();
      setShowListings((prev) => !prev);
    }}>
      {showListings ? 'Hide Listings' : 'Show Listings'}
    </button>
    {showListingsError && (
      <p className='text-center text-red-700 mb-2'>
        {showListingsError}
      </p>
    )}
    {(showListings && !showListingsError && !loading && (userListings.length === 0)) && (
      <p className='text-center text-slate-700 mb-2'>
        You have no listings!
        Create a listing {' '}
        <Link to='/create-listing'
        className='text-Blue font-medium hover:underline'>
          here
        </Link>
      </p>
    )}
    {(showListings && userListings && (userListings.length > 0)) && (
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>
          Your Listings
        </h1>
        {userListings.map( (listing, index) => (
          <div key={index}
          className='border rounded-xl p-2'>
            <p className='text-slate-700 text-center border-b-2 border-slate-300 mb-1'>
              <span className='font-semibold cursor-pointer
              hover:underline truncate'
              onClick={() => navigateToListing(listing._id)}>
                {listing.name}
              </span>
            </p>
            <div className='flex justify-between items-center'>
              <div className='rounded-lg overflow-hidden
              w-[300px] cursor-pointer 
              hover:scale-105 transition-transform duration-300 ease-in-out'>
                <img src={listing.imageUrls[0]} 
                alt='listing cover' 
                className='object-contain'
                onClick={() => navigateToListing(listing._id)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <button className='text-red-700 uppercase
                border-2 border-red-500
                bg-red-300 bg-opacity-60
                hover:bg-opacity-30
                hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-red-300
                py-[1px] px-[4px] rounded-lg'
                onClick={() => handleListingDelete(listing._id)}>
                  Delete
                </button>
                <button className='text-yellow-300 uppercase
                border-2 border-yellow-500
                bg-yellow-200 bg-opacity-30
                hover:bg-opacity-10
                hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-yellow-300/40
                py-[1px] px-[4px] rounded-lg'
                onClick={() => navigate(`/update-listing/${listing._id}`)}>
                  Edit
                </button>
              </div>
            </div>
            {deleteListingError && (
              <p className='text-red-700'>
                {deleteListingError}
              </p>
            )}
          </div>
        ) )
        }
      </div>
    )}
    </>
  );
};

export default UserListings;