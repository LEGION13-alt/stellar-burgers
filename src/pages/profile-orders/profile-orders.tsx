import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { getOrdersAllState } from '../../services/slices/feedSlice';
import { useDispatch } from '../../services/store';
import { TOrder } from '@utils-types';
import { getOrdersAllThunk } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersAllState);

  useEffect(() => {
    dispatch(getOrdersAllThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
