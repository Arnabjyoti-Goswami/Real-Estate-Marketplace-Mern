import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
