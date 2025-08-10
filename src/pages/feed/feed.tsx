import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import {
  getFeedThunk,
  getOrdersAllState
} from '../../services/slices/feedSlice';
import { useDispatch } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersAllState);

  const handleGetFeeds = () => {
    dispatch(getFeedThunk());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
