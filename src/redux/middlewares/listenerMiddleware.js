import { createListenerMiddleware } from '@reduxjs/toolkit';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: (action) => action.type ,
  effect: (action, listenerApi) => {
    // Access the state before dispatching actionX
    const state = listenerApi.getState();

    // Assuming you want to access some part of the state, e.g., state.sliceA
    // const valueFromSliceA = state.sliceA.value;  // Example: accessing the updated state from sliceA

    // Dispatch actionX with a payload from the state
    // listenerApi.dispatch(actionX({ updatedValue: valueFromSliceA }));
  },
});

export default listenerMiddleware.middleware;