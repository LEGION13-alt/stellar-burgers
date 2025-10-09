import ingredientsSlice, {
  initialState,
  getIngredientsThunk
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  }
];

describe('Тест ингредиентов', () => {
  it('должен обрабатывать getIngredientsThunk.pending', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = ingredientsSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('должен обрабатывать getIngredientsThunk.fulfilled', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      ingredients: mockIngredients
    });
  });

  it('должен обрабатывать getIngredientsThunk.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
