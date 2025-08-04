import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import {
  isAuthCheckSelector,
  getUserSelector
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(isAuthCheckSelector);
  const user = useSelector(getUserSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
