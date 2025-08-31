import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrderState {
  loading: boolean;
  order: TOrder | null;
  orders: TOrder[];
  error: string | null;
}

export const initialState: OrderState = {
  loading: false,
  order: null,
  orders: [],
  error: null
};

// заказ по номеру
export const getOrderThunk = createAsyncThunk(
  'feed/getOrderByNumber',
  getOrderByNumberApi
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
        state.loading = false;
        state.order = action.payload.orders[0];
        state.error = null;
      })
      .addCase(getOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
