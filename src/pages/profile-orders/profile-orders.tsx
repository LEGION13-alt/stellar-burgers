import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import {
  getOrdersAllThunk,
  getFeedThunk,
  getOrdersAllState
} from '../../services/slices/feedSlice';
import { useDispatch } from '../../services/store';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersAllState);

  useEffect(() => {
    dispatch(getOrdersAllThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
