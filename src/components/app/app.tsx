import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getUserThunk } from '../../services/slices/userSlice';
import { getIngredientsThunk } from '../../services/slices/ingredientsSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route element={<ProtectedRoute onlyUnAuth={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route path='orders/:number' element={<OrderInfo />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};
export default App;
