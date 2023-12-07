import { combineReducers, configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice.ts';

const rootReducer = combineReducers({
  todos: todoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
