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
    delete newCustomer._id;
    return handleHttpRequestPromise(addCustomerAPI(newCustomer), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
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
      showForStatuses: "400,401,500,404,501",
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
      showForStatuses: "400,401,500,404,501",
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
    setCustomersSearchTerm: (state, action) => {
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
    openAddCustomerPopup: (state, action) => {
      state.addCustomerPopup.isShown = true;
    },
    closeAddCustomerPopup: (state, action) => {
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
  setCustomersSearchTerm,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
  setAddCustomerPopupAddress,
  closeAddCustomerPopup,
  openAddCustomerPopup,
} = customersSlice.actions;

export const selectCustomersSearchTerm = (state) => state.customers.searchTerm;
export const selectAddCustomerPopup = (state) =>
  state.customers.addCustomerPopup;
export const selectCustomers= (state) => state.customers.customers 

export default customersSlice.reducer;
