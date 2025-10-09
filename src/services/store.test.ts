import { rootReducer } from './store';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';

describe('Тест редьюсера', () => {
  it('должен корректно инициализировать начальное состояние всех слайсов', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.constructorBurder).toEqual(
      constructorReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.order).toEqual(
      orderReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.user).toEqual(
      userReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.feed).toEqual(
      feedReducer(undefined, { type: '@@INIT' })
    );
  });

  it('должен содержать все необходимые слайсы', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toHaveProperty('constructorBurder');
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');
  });
});
