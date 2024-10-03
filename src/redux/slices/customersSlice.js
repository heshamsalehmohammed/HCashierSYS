import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addCustomerAPI,
  deleteCustomerAPI,
  editCustomerAPI,
  fetchCustomerAPI,
  fetchCustomersAPI,
} from "../../api/customersAPI";
import _ from "lodash";
import RouterNavigationSingleton from "../routerNavigationSingleton";
import { setOrderCustomer } from "./ordersSlice";

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
    const newCustomer = _.cloneDeep(
      thunkAPI.getState().customers.addCustomerPopup
    );
    const id = newCustomer._id;
    delete newCustomer.isShown;
    delete newCustomer._id;
    return handleHttpRequestPromise(editCustomerAPI(id, newCustomer), {
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
        thunkAPI.dispatch(closeAddCustomerPopup());
        thunkAPI.dispatch(fetchCustomers());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

export const deleteCustomer = createAsyncThunk(
  "stock/deleteCustomer",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(deleteCustomerAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error delete Customer",
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

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().customers.searchTerm;
    if (!searchTerm) {
      return thunkAPI.fulfillWithValue([]);
    }
    return handleHttpRequestPromise(fetchCustomersAPI({ searchTerm }), {
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

export const fetchCustomer = createAsyncThunk(
  "customers/fetchCustomer",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(fetchCustomerAPI(payload), {
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

export const prepareAndopenAddCustomerPopup = createAsyncThunk(
  "customers/prepareAndopenAddCustomerPopup",
  async (payload, thunkAPI) => {
    if (payload) {
      const stockItem = await thunkAPI.dispatch(fetchCustomer(payload));
      thunkAPI.dispatch(populateAddCustomerPopup(stockItem.payload));
    } else {
      thunkAPI.dispatch(openAddCustomerPopup());
    }
  }
);

export const handleNewOrderForCustomerButtonClick = createAsyncThunk(
  "customers/handleNewOrderForCustomerButtonClick",
  async (payload, thunkAPI) => {    
    const navigate = RouterNavigationSingleton.getNavigation();
    const customer = payload.customer;

    thunkAPI.dispatch(closeAddCustomerPopup());
    thunkAPI.dispatch(setOrderCustomer(customer))
    navigate("home/order");
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
    populateAddCustomerPopup: (state, action) => {
      state.addCustomerPopup.isShown = true;
      state.addCustomerPopup._id = action.payload._id;
      state.addCustomerPopup.name = action.payload.name;
      state.addCustomerPopup.phone = action.payload.phone;
      state.addCustomerPopup.address = action.payload.address;
    },
    openAddCustomerPopup: (state, action) => {
      state.addCustomerPopup.isShown = true;
    },
    closeAddCustomerPopup: (state, action) => {
      state.addCustomerPopup.isShown = false;
      state.addCustomerPopup = {
        isShown: false,
        _id: "",
        name: "",
        phone: "",
        address: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addCustomerPopup._id = action.payload._id;
      });
  },
});

export const {
  setCustomersSearchTerm,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
  setAddCustomerPopupAddress,
  populateAddCustomerPopup,
  closeAddCustomerPopup,
  openAddCustomerPopup,
} = customersSlice.actions;

export const selectCustomersSearchTerm = (state) => state.customers.searchTerm;
export const selectAddCustomerPopup = (state) =>
  state.customers.addCustomerPopup;
export const selectCustomers = (state) => state.customers.customers;

export default customersSlice.reducer;
