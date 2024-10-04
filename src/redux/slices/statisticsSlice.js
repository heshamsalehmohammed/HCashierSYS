import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import { fetchStatsAPI } from "../../api/statsAPI";

export const fetchStats = createAsyncThunk(
  "statistics/fetchStats",
  async (payload, thunkAPI) => {
    const storedStats = thunkAPI.getState().statistics;
    const criteria = {
      selectedInitializedOrdersCountOption:
        storedStats.selectedInitializedOrdersCountOption,
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
  mostSoldStockItem: "",
  newlyAddedUsersCount:0,
  newlyAddedUsersCountPercent: 0,

  selectedInitializedOrdersCountOption: 7,
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
    setSelectedInitializedOrdersCountOption: (state, action) => {
      state.selectedInitializedOrdersCountOption = action.payload;
    },
    setSelectedMostSoldStockItemOption: (state, action) => {
      state.selectedMostSoldStockItemOption = action.payload;
    },
    setSelectedNewlyAddedUsersCountOption: (state, action) => {
      state.selectedNewlyAddedUsersCountOption = action.payload;
    },
    setInitializedOrdersCount: (state, action) => {
      state.initializedOrdersCount = action.payload;
    },
    setMostSoldStockItem: (state, action) => {
      state.mostSoldStockItem = action.payload;
    },
    setNewlyAddedUsersCount: (state, action) => {
      state.newlyAddedUsersCount = action.payload;
    },
  },
});

// Selectors
export const selectInitializedOrdersCount = (state) =>
  state.statistics.initializedOrdersCount;

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
  setInitializedOrdersCount,
  setMostSoldStockItem,
  setNewlyAddedUsersCount,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
