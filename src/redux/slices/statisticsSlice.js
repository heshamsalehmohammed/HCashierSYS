import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import { fetchStatsAPI } from "../../api/statsAPI";
import { fetchOrdersItemsPreperations } from "./ordersSlice";


export const updateHomePage = createAsyncThunk(
  "statistics/updateHomePage",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    if(state.route.currentRoute == '/home'){
      // update home page
      thunkAPI.dispatch(fetchOrdersItemsPreperations());
      thunkAPI.dispatch(fetchStats());
    }
  }
);

export const fetchStats = createAsyncThunk(
  "statistics/fetchStats",
  async (payload, thunkAPI) => {
    const storedStats = thunkAPI.getState().statistics;
    const criteria = {
      selectedMostSoldStockItemOption:
        storedStats.selectedMostSoldStockItemOption,
      selectedNewlyAddedUsersCountOption:
        storedStats.selectedNewlyAddedUsersCountOption,
    };
    return handleHttpRequestPromise(fetchStatsAPI(criteria), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error fetch Stats",
        message:
          "An unexpected error occurred, Cannot fetch Stats at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

const initialState = {
  initializedOrdersCount: 0,
  initializedOrdersCountPercent:0,
  mostSoldStockItem: "",
  newlyAddedUsersCount: 0,
  newlyAddedUsersCountPercent: 0,
  selectedMostSoldStockItemOption: 7,
  selectedNewlyAddedUsersCountOption: 7,

  daysOptions: [
    { label: "Last 3 Days", value: 3 },
    { label: "Last 7 Days", value: 7 },
    { label: "Last 14 Days", value: 14 },
    { label: "Last 30 Days", value: 30 },
  ],
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setSelectedMostSoldStockItemOption: (state, action) => {
      state.selectedMostSoldStockItemOption = action.payload;
    },
    setSelectedNewlyAddedUsersCountOption: (state, action) => {
      state.selectedNewlyAddedUsersCountOption = action.payload;
    },
    setInitializedOrdersCount: (state, action) => {
      state.initializedOrdersCount = action.payload;
    },
    increaseInitializedOrdersCountBy: (state, action) => {
      state.initializedOrdersCount += Number(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.initializedOrdersCount = action.payload.initializedOrdersCount;
      state.initializedOrdersCountPercent = action.payload.initializedOrdersCountPercent;
      state.mostSoldStockItem = action.payload.mostSoldStockItem;
      state.newlyAddedUsersCount = action.payload.newlyAddedUsersCount;
      state.newlyAddedUsersCountPercent =
        action.payload.newlyAddedUsersCountPercent;
    });
  },
});

// Selectors
export const selectInitializedOrdersCount = (state) =>
  state.statistics.initializedOrdersCount;
export const selectInitializedOrdersCountPercent = (state)=> state.statistics.initializedOrdersCountPercent; 
export const selectMostSoldStockItem = (state) =>
  state.statistics.mostSoldStockItem;
export const selectNewlyAddedUsersCount = (state) =>
  state.statistics.newlyAddedUsersCount;
export const selectNewlyAddedUsersCountPercent = (state) =>
  state.statistics.newlyAddedUsersCountPercent;

export const selectDaysOptions = (state) => state.statistics.daysOptions;

export const selectSelectedMostSoldStockItemOption = (state) =>
  state.statistics.selectedMostSoldStockItemOption;
export const selectSelectedNewlyAddedUsersCountOption = (state) =>
  state.statistics.selectedNewlyAddedUsersCountOption;

export const {
  setSelectedMostSoldStockItemOption,
  setSelectedNewlyAddedUsersCountOption,
  increaseInitializedOrdersCountBy
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
