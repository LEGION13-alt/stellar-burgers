import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrderState {
  loading: boolean;
  currentOrder: TOrder | null;
  orders: TOrder[]; // для истории
  error: string | null;
}

export const initialState: OrderState = {
  loading: false,
  currentOrder: null,
  orders: [],
  error: null
};

export const getOrderThunk = createAsyncThunk(
  'order/getOrder',
  (number: number) => getOrderByNumberApi(number)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrderState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(getOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
