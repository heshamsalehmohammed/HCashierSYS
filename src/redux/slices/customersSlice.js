import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addCustomerAPI,
  editCustomerAPI,
  fetchCustomersAPI,
} from "../../api/customersAPI";
import _ from "lodash";

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (payload, thunkAPI) => {
    const newCustomer = _.cloneDeep(
      thunkAPI.getState().customers.addCustomerPopup
    );
    delete newCustomer.isShown;
    return handleHttpRequestPromise(addCustomerAPI(newCustomer), {
      type: "openPopup",
      showForStatuses: "500,404,501",
      payload: {
        type: "Error",
        title: "Error add Customer",
        message:
          "An unexpected error occurred, Cannot add Customer at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(fetchCustomers());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        if ([400, 401].includes(error.response.status))
          return thunkAPI.rejectWithValue({
            error: "Invalid username or password",
          });
        return thunkAPI.abort();
      });
  }
);

export const editCustomer = createAsyncThunk(
  "customers/editCustomer",
  async (payload, thunkAPI) => {
    const newCustomer = thunkAPI.getState().customers.addCustomerPopup;
    return handleHttpRequestPromise(editCustomerAPI(payload), {
      type: "openPopup",
      showForStatuses: "500,404,501",
      payload: {
        type: "Error",
        title: "Error add Customer",
        message:
          "An unexpected error occurred, Cannot add Customer at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        if ([400, 401].includes(error.response.status))
          return thunkAPI.rejectWithValue({
            error: "Invalid username or password",
          });
        return thunkAPI.abort();
      });
  }
);

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().customers.searchTerm;
    if(!searchTerm){
      return thunkAPI.fulfillWithValue([]);
    }
    return handleHttpRequestPromise(fetchCustomersAPI({searchTerm}), {
      type: "openPopup",
      showForStatuses: "500,404,501",
      payload: {
        type: "Error",
        title: "Error add Customer",
        message:
          "An unexpected error occurred, Cannot add Customer at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        if ([400, 401].includes(error.response.status))
          return thunkAPI.rejectWithValue({
            error: "Invalid username or password",
          });
        return thunkAPI.abort();
      });
  }
);

// Define initial state
const initialState = {
  searchTerm: "",
  customers: [],
  addCustomerPopup: {
    isShown: false,
    _id: "",
    name: "",
    phone: "",
    address: "",
  },
};

const customersSlice = createSlice({
  name: "customers",
  initialState: initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setAddCustomerPopupName: (state, action) => {
      state.addCustomerPopup.name = action.payload;
    },
    setAddCustomerPopupPhone: (state, action) => {
      state.addCustomerPopup.phone = action.payload;
    },
    setAddCustomerPopupAddress: (state, action) => {
      state.addCustomerPopup.address = action.payload;
    },
    openAddCustomerPopupAddress: (state, action) => {
      state.addCustomerPopup.isShown = true;
    },
    closeAddCustomerPopupAddress: (state, action) => {
      state.addCustomerPopup.isShown = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.customers = action.payload
    });
  },
});

export const {
  setSearchTerm,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
  setAddCustomerPopupAddress,
  closeAddCustomerPopupAddress,
  openAddCustomerPopupAddress,
} = customersSlice.actions;

export const selectSearchTerm = (state) => state.customers.searchTerm;
export const selectAddCustomerPopup = (state) =>
  state.customers.addCustomerPopup;
export const selectCustomers= (state) => state.customers.customers 

export default customersSlice.reducer;
