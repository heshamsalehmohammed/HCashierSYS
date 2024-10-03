import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addOrderAPI,
  deleteOrderAPI,
  editOrderAPI,
  fetchOrderAPI,
  fetchOrdersAPI,
} from "../../api/ordersAPI";
import _ from "lodash";

export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (payload, thunkAPI) => {
    const newOrder = _.cloneDeep(
      thunkAPI.getState().orders.currentOrder
    );
    delete newOrder.isShown;
    delete newOrder._id;
    return handleHttpRequestPromise(addOrderAPI(newOrder), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error add Order",
        message:
          "An unexpected error occurred, Cannot add Order at thee moment. ",
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

export const editOrder = createAsyncThunk(
  "orders/editOrder",
  async (payload, thunkAPI) => {
    const newOrder = _.cloneDeep(
      thunkAPI.getState().orders.currentOrder
    );
    const id = newOrder._id;
    delete newOrder.isShown;
    delete newOrder._id;
    return handleHttpRequestPromise(editOrderAPI(id, newOrder), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error add Order",
        message:
          "An unexpected error occurred, Cannot add Order at thee moment. ",
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

export const deleteOrder = createAsyncThunk(
  "stock/deleteOrder",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(deleteOrderAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error delete Order",
        message:
          "An unexpected error occurred, Cannot add Order at thee moment. ",
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

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().orders.searchTerm;
    if (!searchTerm) {
      return thunkAPI.fulfillWithValue([]);
    }
    return handleHttpRequestPromise(fetchOrdersAPI({ searchTerm }), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error add Order",
        message:
          "An unexpected error occurred, Cannot add Order at thee moment. ",
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

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(fetchOrderAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error add Order",
        message:
          "An unexpected error occurred, Cannot add Order at thee moment. ",
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

/*

order => items => item => stockItemCustomizationsSelectedOption

{
  stockItemCustomizationId: 0,
  stockItemCustomizationName: '',
  stockItemCustomizationSelectedOptionId: 0,
  stockItemCustomizationSelectedOptionName: '',
  stockItemCustomizationSelectedOptionAdditionalPrice: 0,
}

order => items => item 
{
  _id: '',
  stockItemId: 0,
  stockItemCustomizationsSelectedOption: []
  amount: 0,
  price: 100
}

order => customer
{
    name: "",
    phone: "",
    address: "",
}

*/

const OrderStatus = Object.freeze({
  PROCESSING: 1,
  DELIVERED: 2,
  CANCELED: 3,
});

// Define initial state
const initialState = {
  searchTerm: "",
  orderSatuses:[],
  orders: [],
  currentOrder: {
    _id: "",
    date: new Date(),
    customerId: 0,
    customer: {},
    items: [],
    totalPrice: 0,
    orderStatus: 0
  },
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    setOrdersSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setOrderCustomer: (state, action) => {
      state.currentOrder.customerId = action.payload._id;
      state.currentOrder.customer.name = action.payload.name;
      state.currentOrder.customer.phone = action.payload.phone;
      state.currentOrder.customer.address = action.payload.address;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.currentOrder._id = action.payload._id;
      });
  },
});

export const {
  setOrdersSearchTerm,
  setOrderCustomer
} = ordersSlice.actions;

export const selectOrdersSearchTerm = (state) => state.orders.searchTerm;
export const selectCurrentOrder = (state) =>
  state.orders.currentOrder;
export const selectOrders = (state) => state.orders.orders;

export default ordersSlice.reducer;
