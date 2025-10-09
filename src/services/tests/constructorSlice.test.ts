import constructorSlice, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
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
};

const mockMainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

describe('Тест конструктора бургера', () => {
  it('должен возвращать начальное состояние', () => {
    const state = constructorSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('должен добавлять булку', () => {
    const action = addIngredient(mockIngredient);
    const state = constructorSlice(initialState, action);

    expect(state.constructorItems.bun).toEqual({
      ...mockIngredient,
      id: expect.any(String)
    });
  });

  it('должен добавлять основной ингредиент', () => {
    const action = addIngredient(mockMainIngredient);
    const state = constructorSlice(initialState, action);

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mockMainIngredient,
      id: expect.any(String)
    });
  });

  it('должен удалять ингредиент', () => {
    const addAction = addIngredient(mockMainIngredient);
    let state = constructorSlice(initialState, addAction);

    const ingredientId = state.constructorItems.ingredients[0].id;
    const removeAction = removeIngredient(ingredientId);
    state = constructorSlice(state, removeAction);

    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент вверх', () => {
    const ingredient1 = addIngredient(mockMainIngredient);
    let state = constructorSlice(initialState, ingredient1);

    const mockMainIngredient2 = { ...mockMainIngredient, _id: 'test2' };
    const ingredient2 = addIngredient(mockMainIngredient2);
    state = constructorSlice(state, ingredient2);

    const moveAction = moveIngredientUp(1);
    state = constructorSlice(state, moveAction);

    expect(state.constructorItems.ingredients[0]._id).toBe('test2');
    expect(state.constructorItems.ingredients[1]._id).toBe(
      mockMainIngredient._id
    );
  });

  it('должен перемещать ингредиент вниз', () => {
    const ingredient1 = addIngredient(mockMainIngredient);
    let state = constructorSlice(initialState, ingredient1);

    const mockMainIngredient2 = { ...mockMainIngredient, _id: 'test2' };
    const ingredient2 = addIngredient(mockMainIngredient2);
    state = constructorSlice(state, ingredient2);

    const moveAction = moveIngredientDown(0);
    state = constructorSlice(state, moveAction);

    expect(state.constructorItems.ingredients[0]._id).toBe('test2');
    expect(state.constructorItems.ingredients[1]._id).toBe(
      mockMainIngredient._id
    );
  });
});
