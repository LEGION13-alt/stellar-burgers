import orderSlice, {
  initialState,
  getOrderThunk
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345
};

const mockOrderResponse = {
  success: true,
  orders: [mockOrder]
};

describe('Тест заказа', () => {
  it('должен возвращать начальное состояние', () => {
    const state = orderSlice(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('getOrderThunk', () => {
    it('должен обрабатывать getOrderThunk.pending', () => {
      const action = { type: getOrderThunk.pending.type };
      const state = orderSlice(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('должен обрабатывать getOrderThunk.fulfilled', () => {
      const action = {
        type: getOrderThunk.fulfilled.type,
        payload: mockOrderResponse
      };
      const state = orderSlice(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        order: mockOrder
      });
    });

    it('должен обрабатывать getOrderThunk.rejected', () => {
      const errorMessage = 'Failed to fetch order';
      const action = {
        type: getOrderThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice(initialState, action);
      
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  it('должен обрабатывать несколько заказов в ответе', () => {
    const multipleOrdersResponse = {
      success: true,
      orders: [mockOrder, { ...mockOrder, _id: '2', number: 12346 }]
    };

    const action = {
      type: getOrderThunk.fulfilled.type,
      payload: multipleOrdersResponse
    };
    const state = orderSlice(initialState, action);
    
    expect(state.order).toEqual(mockOrder); //первый заказ
  });

  it('должен обрабатывать пустой массив заказов', () => {
    const emptyOrdersResponse = {
      success: true,
      orders: []
    };

    const action = {
      type: getOrderThunk.fulfilled.type,
      payload: emptyOrdersResponse
    };
    const state = orderSlice(initialState, action);
    
    expect(state.order).toBeNull();
  });
});