import { createListenerMiddleware } from '@reduxjs/toolkit';
import { fetchStats, setSelectedMostSoldStockItemOption, setSelectedNewlyAddedUsersCountOption } from '../slices/statisticsSlice';

const listenerMiddleware = createListenerMiddleware();

// Add listener for setSelectedMostSoldStockItemOption action
listenerMiddleware.startListening({
  actionCreator: setSelectedMostSoldStockItemOption,
  effect: async (action, { dispatch, getState }) => {
    const state = getState();

    // Dispatch the fetchStats action with the updated state
    dispatch(fetchStats());
  },
});

// Add listener for setSelectedNewlyAddedUsersCountOption action
listenerMiddleware.startListening({
  actionCreator: setSelectedNewlyAddedUsersCountOption,
  effect: async (action, { dispatch, getState }) => {
    const state = getState();

    // Dispatch the fetchStats action with the updated state
    dispatch(fetchStats());
  },
});

export default listenerMiddleware.middleware;