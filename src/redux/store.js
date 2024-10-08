// store.js

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import utilitiesReducer from './slices/utilitiesSlice';
import customersSlice from './slices/customersSlice';
import listenerMiddleware from './middlewares/listenerMiddleware';
import stockSlice from './slices/stockSlice';
import ordersReducer from './slices/ordersSlice';
import statisticsSlice from './slices/statisticsSlice';
import masterUserSlice from './slices/masterUserSlice';
import usersSlice from './slices/usersSlice';

// Persist Configs for Individual Slices

// Utilities Persist Config - Exclude 'socket'
const utilitiesPersistConfig = {
  key: 'utilities',
  storage,
  blacklist: ['socket','socketInitialized','loading'], // Exclude 'socket' from being persisted
};

// Auth Persist Config - Persist 'user' data
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'], // Persist 'user' data to maintain authentication state
};


const ordersPersistConfig = {
  key: 'orders',
  storage,
  whitelist: ['currentOrder'], // Persist 'user' data to maintain authentication state
};

// Apply persistReducer to individual slices
const persistedUtilitiesReducer = persistReducer(utilitiesPersistConfig, utilitiesReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedordersReducer = persistReducer(ordersPersistConfig, ordersReducer);

// Combine Reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,         // Persisted auth reducer
  utilities: persistedUtilitiesReducer, // Persisted utilities reducer
  customers: customersSlice,          // Non-persisted reducers
  orders: persistedordersReducer,
  stock: stockSlice,
  statistics: statisticsSlice,
  masterUser: masterUserSlice,
  users: usersSlice
});

// Configure Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(listenerMiddleware),
});

export const persistor = persistStore(store);
