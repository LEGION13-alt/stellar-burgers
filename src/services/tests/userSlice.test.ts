import userSlice, { initialState, getUserThunk } from '../slices/userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'elflorian@yandex.ru',
  name: 'Legion'
};

describe('Тест экшенов пользователя', () => {
  it('должен обрабатывать getUserThunk.pending', () => {
    const action = { type: getUserThunk.pending.type };
    const state = userSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true
    });
  });

  it('должен обрабатывать getUserThunk.fulfilled', () => {
    const action = {
      type: getUserThunk.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      user: mockUser,
      isAuthChecked: true
    });
  });

  it('должен обрабатывать getUserThunk.rejected', () => {
    const errorMessage = 'Failed to fetch user';
    const action = {
      type: getUserThunk.rejected.type,
      error: { message: errorMessage }
    };
    const state = userSlice(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
