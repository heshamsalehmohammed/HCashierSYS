import { createListenerMiddleware } from '@reduxjs/toolkit';
import { fetchStats, setSelectedMostSoldStockItemOption, setSelectedNewlyAddedUsersCountOption } from '../slices/statisticsSlice';
import { fetchOrders, setOrdersFilterCriteria } from '../slices/ordersSlice';

const listenerMiddleware = createListenerMiddleware();

// Add listener for setSelectedMostSoldStockItemOption action
listenerMiddleware.startListening({
  actionCreator: setSelectedMostSoldStockItemOption,
  effect: async (action, { dispatch, getState }) => {
    const state = getState();

    dispatch(fetchStats());
  },
});

// Add listener for setSelectedNewlyAddedUsersCountOption action
listenerMiddleware.startListening({
  actionCreator: setSelectedNewlyAddedUsersCountOption,
  effect: async (action, { dispatch, getState }) => {
    const state = getState();

    dispatch(fetchStats());
  },
});


listenerMiddleware.startListening({
  actionCreator: setOrdersFilterCriteria,
  effect: async (action, { dispatch, getState }) => {
    const state = getState();

    dispatch(fetchOrders());
  },
});

export default listenerMiddleware.middleware;