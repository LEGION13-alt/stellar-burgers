import {
  configureStore,
  combineReducers,
  combineSlices
} from '@reduxjs/toolkit';

import ingredientsSlice from './slices/ingredientsSlice';
import orderSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import feedSlice from './slices/feedSlice';
import constructorSlice from './slices/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  constructorBurder: constructorSlice,
  ingredients: ingredientsSlice,
  order: orderSlice,
  user: userSlice,
  feed: feedSlice
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
