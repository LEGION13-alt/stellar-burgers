import { configureStore, combineReducers } from '@reduxjs/toolkit';

import ingredientsReduser from './slices/ingredientsSlice';
import orderReduser from './slices/orderSlice';
import userReduser from './slices/userSlice';
import feedReduser from './slices/feedSlice';
import constructorReduser from './slices/constructorSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  constructorBurder: constructorReduser,
  ingredients: ingredientsReduser,
  order: orderReduser,
  user: userReduser,
  feed: feedReduser
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
