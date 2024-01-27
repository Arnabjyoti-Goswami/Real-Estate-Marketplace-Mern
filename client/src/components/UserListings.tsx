import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { RootState } from '@/redux/store';
import { deleteApi, getApi } from '@/apiCalls/fetchHook';
import { ListingsSchema } from '@/zod-schemas/apiSchemas';
import type { TListing, TUser } from 'zod-schemas/apiSchemas';

const UserListings = () => {
  const { currentUser: user } = useSelector((state: RootState) => state.user);
  const currentUser = user as TUser;

  const [showListings, setShowListings] = useState(false);
  const [userListings, setUserListings] = useState<TListing[]>([]);
  const [deleteListingError, setDeleteListingError] = useState('');

  const fetchUserListings = async () => {
    const url = `/api/user/listings/${currentUser._id}` as const;
    const data = await getApi(url);
    const parse = ListingsSchema.parse(data);
    return parse;
  };

  const {
    data: dataFetchListings,
    isLoading: isLoadingFetchListings,
    error: errorFetchListings,
    isError: isErrorFetchListings,
  } = useQuery({
    queryFn: () => fetchUserListings(),
    queryKey: ['showUserListings', currentUser._id],
    enabled: showListings,
  });
  if (dataFetchListings) {
    setUserListings(dataFetchListings);
  }

  const navigate = useNavigate();
  const navigateToListing = (id: string) => {
    navigate(`/listing/${id}`);
  };

  const {
    mutate: mutateDeleteListing,
    error,
    isError,
  } = useMutation({
    mutationFn: async (listingId: string) => {
      const url = `/api/listing/delete/${listingId}` as const;
      await deleteApi(url);
    },
  });
  if (isError) setDeleteListingError(error.message);

  const handleListingDelete = async (listingId: string) => {
    mutateDeleteListing(listingId);

    setUserListings((prev) =>
      prev.filter((listing) => listing._id !== listingId)
    );
  };

  return (
    <>
      <button
        className='text-green-700 
        w-[40%] mt-5 ml-[30%] py-3 px-5
        rounded-lg uppercase
        border border-slate-500
        hover:shadow-lg hover:shadow-slate-300 hover:bg-slate-100/40
        whitespace-nowrap font-medium mb-2'
        onClick={() => {
          setShowListings((prev) => !prev);
        }}
      >
        {showListings ? 'Hide Listings' : 'Show Listings'}
      </button>
      {isErrorFetchListings && (
        <p className='text-center text-red-700 mb-2'>
          {errorFetchListings.message}
        </p>
      )}
      {showListings &&
        !isErrorFetchListings &&
        !isLoadingFetchListings &&
        userListings.length === 0 && (
          <p className='text-center text-slate-700 mb-2'>
            You have no listings! Create a listing{' '}
            <Link
              to='/create-listing'
              className='text-Blue font-medium hover:underline'
            >
              here
            </Link>
          </p>
        )}
      {showListings && userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing, index) => (
            <div key={index} className='border rounded-xl p-2'>
              <p className='text-slate-700 text-center border-b-2 border-slate-300 mb-1'>
                <span
                  className='font-semibold cursor-pointer
                  hover:underline truncate'
                  onClick={() => navigateToListing(listing._id)}
                >
                  {listing.name}
                </span>
              </p>
              <div className='flex justify-between items-center'>
                <div
                  className='rounded-lg overflow-hidden
                  w-[300px] cursor-pointer 
                  hover:scale-105 transition-transform duration-300 ease-in-out'
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='object-contain'
                    onClick={() => navigateToListing(listing._id)}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <button
                    className='text-red-700 uppercase
                    border-2 border-red-500
                    bg-red-300 bg-opacity-60
                    hover:bg-opacity-30
                    hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-red-300
                    py-[1px] px-[4px] rounded-lg'
                    onClick={() => handleListingDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <button
                    className='text-yellow-300 uppercase
                    border-2 border-yellow-500
                    bg-yellow-200 bg-opacity-30
                    hover:bg-opacity-10
                    hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-yellow-300/40
                    py-[1px] px-[4px] rounded-lg'
                    onClick={() => navigate(`/update-listing/${listing._id}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
              {deleteListingError && (
                <p className='text-red-700'>{deleteListingError}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserListings;
