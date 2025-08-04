import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

//регистрация
export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => await registerUserApi(registerData)
);
//логин
export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    if (!data.success) {
      return data;
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data; //user;
  }
);
//логаут
export const logoutUserThunk = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

//обновить польз
export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  (userData: Partial<TRegisterData>) => updateUserApi(userData)
);
//забыл пароль
export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
    return true;
  }
);
//сброс пароля
export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
    return true;
  }
);
//получить польз
export const getUserThunk = createAsyncThunk('user/getUser', getUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getUserStateSelector: (state) => state,
    getUserSelector: (state) => state.user,
    isAuthCheckSelector: (state) => state.isAuthChecked,
    getUserErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Логин
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Логаут
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Обновление пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Запрос на восстановление пароля
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      // Сброс пароля
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      // Получение пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  }
});

export const { authCheck, clearError } = userSlice.actions;

// Селекторы
export const {
  getUserStateSelector,
  getUserSelector,
  isAuthCheckSelector,
  getUserErrorSelector
} = userSlice.selectors;

export default userSlice.reducer;
