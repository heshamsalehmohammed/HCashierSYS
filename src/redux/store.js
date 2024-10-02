import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import utilitiesReducer from './slices/utilitiesSlice';
import customersSlice from './slices/customersSlice';
import  listenerMiddleware  from './middlewares/listenerMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  utilities: utilitiesReducer,
  customers: customersSlice
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(listenerMiddleware),
});

export const persistor = persistStore(store);