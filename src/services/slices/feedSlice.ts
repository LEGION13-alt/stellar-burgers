import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);

export const getOrdersAllThunk = createAsyncThunk(
  'feed/getFeedProfile',
  getOrdersApi
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedState: (state) => state,
    getOrdersAllState: (state) => state.orders
    //getFeedLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrdersAllThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersAllThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrdersAllThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { getFeedState, getOrdersAllState } = feedSlice.selectors;
export default feedSlice.reducer;
