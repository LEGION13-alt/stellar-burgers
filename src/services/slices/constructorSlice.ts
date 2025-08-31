import { orderBurgerApi } from '../../utils/burger-api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export interface ConstructorState {
  loading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

export const initialState: ConstructorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrderBurgerThunk = createAsyncThunk(
  'constructorBurder/order',
  orderBurgerApi
);

export const constructorSlice = createSlice({
  name: 'constructorBurder',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index > 0) {
        const current = ingredients[index];
        ingredients[index] = ingredients[index - 1];
        ingredients[index - 1] = current;
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index < ingredients.length - 1) {
        const current = ingredients[index];
        ingredients[index] = ingredients[index + 1];
        ingredients[index + 1] = current;
      }
    },
    setRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getConstructorState: (state) => state,
    getConstructorLoading: (state) => state.loading,
    getOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderBurgerThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(sendOrderBurgerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(sendOrderBurgerThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message as string;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setRequest,
  resetModal
} = constructorSlice.actions;

export const { getConstructorState, getConstructorLoading, getOrderRequest } =
  constructorSlice.selectors;
export default constructorSlice.reducer;
