import feedSlice, {
  initialState,
  getFeedThunk,
  getOrdersAllThunk
} from '../slices/feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Order 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 1
  }
];

const mockFeedData = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

describe('Тест ленты заказов', () => {
  it('должен возвращать начальное состояние', () => {
    const state = feedSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('getFeedThunk', () => {
    it('должен обрабатывать getFeedThunk.pending', () => {
      const action = { type: getFeedThunk.pending.type };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать getFeedThunk.fulfilled', () => {
      const action = {
        type: getFeedThunk.fulfilled.type,
        payload: mockFeedData
      };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        orders: mockOrders,
        total: 100,
        totalToday: 10
      });
    });

    it('должен обрабатывать getFeedThunk.rejected', () => {
      const errorMessage = 'Failed to fetch feed';
      const action = {
        type: getFeedThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('getOrdersAllThunk', () => {
    it('должен обрабатывать getOrdersAllThunk.pending', () => {
      const action = { type: getOrdersAllThunk.pending.type };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать getOrdersAllThunk.fulfilled', () => {
      const action = {
        type: getOrdersAllThunk.fulfilled.type,
        payload: mockOrders
      };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        orders: mockOrders
      });
    });

    it('должен обрабатывать getOrdersAllThunk.rejected', () => {
      const errorMessage = 'Failed to fetch orders';
      const action = {
        type: getOrdersAllThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = feedSlice(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
