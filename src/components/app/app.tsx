import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredientsThunk } from '../../services/slices/ingredientsSlice';
import { getUserThunk } from '../../services/slices/userSlice';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '../../pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '../';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route';

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  // Инициализация приложения
  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        {/* Публичные маршруты (доступны всем) */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Маршруты только для НЕавторизованных пользователей */}
        <Route element={<ProtectedRoute onlyUnAuth={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/* Маршруты только для авторизованных пользователей */}
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route path='orders/:number' element={<OrderInfo />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна (открываются поверх текущего маршрута) */}
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

          <Route element={<ProtectedRoute onlyUnAuth />}>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
