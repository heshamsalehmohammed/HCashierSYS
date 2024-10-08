import { createSlice } from "@reduxjs/toolkit";

const MAX_HISTORY_LENGTH = 20;

const initialState = {
  routesHistory: [],
  currentRoute: "",
};

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setRoute: (state, action) => {
      state.currentRoute = action.payload;
      const lastItem = state.routesHistory[state.routesHistory.length - 1];
      if (lastItem === action.payload) {
        state.routesHistory.pop();
      }
      state.routesHistory = [
        ...state.routesHistory.slice(-MAX_HISTORY_LENGTH + 1),
        action.payload,
      ];
    },
    clearRoutesHistory: (state) => {
      state.routesHistory = [];
    }
  },
});

export const { setRoute, clearRoutesHistory} = routeSlice.actions;

export default routeSlice.reducer;
