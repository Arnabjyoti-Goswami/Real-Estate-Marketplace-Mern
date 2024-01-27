import { useState, useEffect } from 'react';
import type { FormEvent, ElementRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { ListingsSchema, type TListings } from '@/zod-schemas/apiSchemas';
import ListingCard from '@/components/ListingCard';
import { getApi } from '@/apiCalls/fetchHook';

const SearchListing = () => {
  const navigate = useNavigate();

  const [sidebarSearchParams, setSidebarSearchParams] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const [listings, setListings] = useState<TListings>([]);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (
    e: ChangeEvent<ElementRef<'input'>> | ChangeEvent<ElementRef<'select'>>
  ) => {
    if (e.target.id === 'searchTerm') {
      setSidebarSearchParams({
        ...sidebarSearchParams,
        searchTerm: e.target.value,
      });
    } else if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebarSearchParams({
        ...sidebarSearchParams,
        type: e.target.id,
      });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebarSearchParams({
        ...sidebarSearchParams,
        [e.target.id]: (e.target as HTMLInputElement).checked,
      });
    } else if (e.target.id === 'sort_order') {
      const sort_order = e.target.value.split('_');
      setSidebarSearchParams({
        ...sidebarSearchParams,
        sort: sort_order[0] || 'createdAt',
        order: sort_order[1] || 'desc',
      });
    }
  };

  const updateUrl = () => {
    const urlParams = new URLSearchParams(location.search);

    urlParams.set('searchTerm', sidebarSearchParams.searchTerm);
    urlParams.set('type', sidebarSearchParams.type);
    urlParams.set('parking', sidebarSearchParams.parking.toString());
    urlParams.set('furnished', sidebarSearchParams.furnished.toString());
    urlParams.set('offer', sidebarSearchParams.offer.toString());
    urlParams.set('sort', sidebarSearchParams.sort);
    urlParams.set('order', sidebarSearchParams.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`, { replace: true });
  };

  const handleSubmit = (e: FormEvent<ElementRef<'form'>>) => {
    e.preventDefault();
    updateUrl();
    fetchListings();
  };

  const getSearchQueriesFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);

    const searchTerm = urlParams.get('searchTerm') || '';
    const type = urlParams.get('type') || 'all';

    const parking = urlParams.get('parking') === 'true' ? true : false;
    const furnished = urlParams.get('furnished') === 'true' ? true : false;
    const offer = urlParams.get('offer') === 'true' ? true : false;

    const sort = urlParams.get('sort') || 'createdAt';
    const order = urlParams.get('order') || 'desc';

    const searchQueriesFromUrl = {
      searchTerm,
      type,
      parking,
      furnished,
      offer,
      sort,
      order,
    };
    setSidebarSearchParams(searchQueriesFromUrl);
  };

  const { mutate: mutateFetchSearchParamsListings, isPending: loading } =
    useMutation({
      mutationFn: async (params: URLSearchParams) => {
        const searchQuery = params.toString();
        const url = `/api/listing/get?${searchQuery}` as const;
        const data = await getApi(url);
        const parse = ListingsSchema.parse(data);
        return parse;
      },
      onSuccess: (data) => {
        if (data.length !== 0 && data.length % 9 === 0) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      },
    });

  const fetchListings = async () => {
    setShowMore(false);
    const urlParams = new URLSearchParams(location.search);
    mutateFetchSearchParamsListings(urlParams);
  };

  useEffect(() => {
    getSearchQueriesFromUrl();
  }, [location.search]);

  const handleShowMoreListings = () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex.toString());
    mutateFetchSearchParamsListings(urlParams);
  };

  return (
    <div
      className='flex flex-col 
      md:flex-row'
    >
      <div
        className='p-7 border-b-2 
        md:border-r-2 md:min-h-screen'
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebarSearchParams.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.type === 'sale'}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Ammenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebarSearchParams.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              id='sort_order'
              value={sidebarSearchParams.sort + '_' + sidebarSearchParams.order}
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button
            className='bg-slate-700 text-white p-3 rounded-lg uppercase
            hover:opacity-95'
          >
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No Listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={handleShowMoreListings}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchListing;
