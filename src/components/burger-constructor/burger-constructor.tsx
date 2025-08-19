import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getConstructorState,
  sendOrderBurgerThunk,
  resetModal,
  setRequest
} from '../../services/slices/constructorSlice';
import { getUserSelector } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    constructorItems = { bun: null, ingredients: [] },
    orderModalData,
    orderRequest
  } = useSelector(getConstructorState);

  const user = useSelector(getUserSelector);

  const onOrderClick = () => {
    //переброс не зарег.польз на стр.рег
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    //проверка на наличие булки
    if (!constructorItems.bun) {
      console.error('Не выбрана булка!');
      return;
    }

    //проверка на начинку
    if (constructorItems.ingredients.length === 0) {
      console.error('Добавьте начинку для заказа!');
      return;
    }

    if (orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(sendOrderBurgerThunk(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
