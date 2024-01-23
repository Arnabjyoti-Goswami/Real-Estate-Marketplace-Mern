import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingCard = ({ listing }) => {
  return (
    <div className='bg-white shadow-md rounded-lg
    hover:shadow-lg transition-shadow ease-in-out duration-300
    overflow-hidden'>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0] || 'https://foreignbuyerswatch.com/wp-content/uploads/2019/07/Capture-d%E2%80%99e%CC%81cran-2019-07-26-a%CC%80-13.14.52.png'}
        alt={'Listing name: ' + listing.name} 
        className='h-[320px] sm:h-[220px] w-full object-cover 
        hover:scale-105 transition-scale duration-300 ease-in-out'/>
        <div className='p-3 flex flex-col gap-2 w-full mt-2'>
          <p className='text-lg font-semibold text-slate-700 truncate'>
            {listing.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='w-full
            text-sm text-gray-600 truncate'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold'>
            $
            {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1 ? `${listing.bedrooms} Baths` : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;