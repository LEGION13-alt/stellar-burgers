import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

export const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientState: (state) => state,
    getIngredientsStateLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { getIngredientState, getIngredientsStateLoading } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
