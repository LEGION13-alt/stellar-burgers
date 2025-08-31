import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  isAuthCheckSelector,
  getUserLoadingSelector
} from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(isAuthCheckSelector);
  const from = location.state?.from || '/';
  const isUserDataLoading = useSelector(getUserLoadingSelector);

  if (isUserDataLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && isAuthChecked) {
    return <Navigate to={from} replace />;
  }

  if (onlyUnAuth && !isAuthChecked) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
