import { useParams } from 'react-router-dom';

const Listing = () => {
  const { id : listingId } = useParams();

  return (
    <div>
      {listingId}
    </div>
  );
};

export default Listing;