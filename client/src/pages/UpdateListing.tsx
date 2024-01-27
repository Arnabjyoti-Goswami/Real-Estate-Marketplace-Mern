import { useParams } from 'react-router-dom';
import ListingForm from '../components/ListingForm.jsx';

const UpdateListing = () => {
  const { id: idRouteParam } = useParams();

  return <ListingForm type='update' idRouteParam={idRouteParam as string} />;
};

export default UpdateListing;
