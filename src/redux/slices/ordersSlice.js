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
import {
  closeAddStockItemPopup,
  fetchStockItem,
  populateAddStockItemPopup,
} from "./stockSlice";

export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (payload, thunkAPI) => {
    const newOrder = _.cloneDeep(thunkAPI.getState().orders.currentOrder);
    delete newOrder._id;
    delete newOrder.customer;
    delete newOrder.orderStatus;
    delete newOrder.date;
    delete newOrder.statusChangeDate;
    delete newOrder.updatedDate;

    newOrder.items.forEach((item) => {
      delete item._id;
      delete item.stockItemName;
      delete item.itemIndexInOrder
      item.stockItemCustomizationsSelectedOptions.forEach((option) => {
        delete option._id;
        delete option.stockItemCustomizationName;
        delete option.stockItemCustomizationSelectedOptionName;
      });
    });

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
    let newOrder = _.cloneDeep(thunkAPI.getState().orders.currentOrder);
    const id = newOrder._id;
    delete newOrder._id;
    delete newOrder.customer;
    delete newOrder.orderStatus;
    delete newOrder.date;
    delete newOrder.statusChangeDate;
    delete newOrder.updatedDate;
    newOrder.items.forEach((item) => {
      delete item._id;
      delete item.stockItemName;
      delete item.itemIndexInOrder
      item.stockItemCustomizationsSelectedOptions.forEach((option) => {
        delete option._id;
        delete option.stockItemCustomizationName;
        delete option.stockItemCustomizationSelectedOptionName;
      });
    });
    if(payload){
      newOrder = {
        ...newOrder,
        ...payload
      }
    }
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

export const prepareAndOpenSelectStockItemForOrderPopup = createAsyncThunk(
  "orders/prepareAndOpenSelectStockItemForOrderPopup",
  async (payload, thunkAPI) => {
    if (payload) {
      const stockItem = await thunkAPI.dispatch(fetchStockItem(payload.id));
      thunkAPI.dispatch(populateAddStockItemPopup(stockItem.payload));
      thunkAPI.dispatch(
        populateSelectStockItemForOrderPopup({
          stockItem: stockItem.payload,
          orderStockItem: payload.oerderStockItem,
        })
      );
    }
    thunkAPI.dispatch(openSelectStockItemForOrderPopup());
  }
);

export const prepareAndCloseSelectStockItemForOrderPopup = createAsyncThunk(
  "orders/prepareAndCloseSelectStockItemForOrderPopup",
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(closeAddStockItemPopup());
    thunkAPI.dispatch(closeSelectStockItemForOrderPopup());
  }
);

const calculateAndSetSelectStockItemForOrderPopupPrice = (state) => {
  const calculatedPrice =
    state.selectStockItemForOrderPopup.amount *
    (state.selectStockItemForOrderPopup.stockItemPrice +
      state.selectStockItemForOrderPopup.stockItemCustomizationsSelectedOptions.reduce(
        (acc, cur) =>
          acc + cur.stockItemCustomizationSelectedOptionAdditionalPrice,
        0
      ));

  state.selectStockItemForOrderPopup.price = calculatedPrice;
};

const calculateCurrentOrderPrice = (state) => {
  const calculatedPrice = state.currentOrder.items.reduce(
    (acc, cur) => acc + cur.price,
    0
  );

  state.currentOrder.totalPrice = calculatedPrice;
};

const _closeSelectStockItemForOrderPopup = (state) => {
  state.selectStockItemForOrderPopup = {
    isShown: false,
    itemIndexInOrder: null,
    stockItemId: 0,
    stockItemName: "",
    stockItemPrice: 0,
    stockItemCustomizationsSelectedOptions: [],
    amount: 0,
    price: 0,
  };
};


export const OrderStatusEnum = Object.freeze({
  INITIALIZED: 1,
  PROCESSING: 2,
  DELIVERED: 3,
  CANCELED: 4,
});


/* 

{
  stockItemId: '66fe8ce652f8599d1d78cf5f',
  stockItemName: 'fra5',
  stockItemPrice: 55,
  stockItemCustomizationsSelectedOptions: [
    {
      stockItemCustomizationId: '66fe9b9052f8599d1d78cfeb',
      stockItemCustomizationName: 'no3 el fra5',
      stockItemCustomizationSelectedOptionId: '66fe9b9052f8599d1d78cfec',
      stockItemCustomizationSelectedOptionName: 'balady',
      stockItemCustomizationSelectedOptionAdditionalPrice: 20
    }
  ],
  amount: 1,
  price: 75
}

*/

// Define initial state
const initialState = {
  searchTerm: "",
  orderSatuses: [
    { _id: 1, name: "INITIALIZED", label: "Initialized"  ,severity: "info"},
    { _id: 2, name: "PROCESSING", label: "Processing" , severity: "warning"},
    { _id: 3, name: "DELIVERED", label: "Delivered", severity: "success" },
    { _id: 4, name: "CANCELED", label: "Canceled", severity: "danger" },
  ],
  orders: [],
  searchStockItemForOrderPopup: {
    isShown: false,
  },
  selectStockItemForOrderPopup: {
    isShown: false,
    itemIndexInOrder: null,
    stockItemId: 0,
    stockItemName: "",
    stockItemPrice: 0,
    stockItemCustomizationsSelectedOptions: [],
    amount: 0,
    price: 0,
  },
  currentOrder: {
    _id: "",
    date: new Date(),
    statusChangeDate: null,
    updatedDate: null,
    customerId: 0,
    customer: {},
    items: [],
    totalPrice: 0,
    orderStatusId: 0,
    orderStatus: {
      _id: 0,
      name: "",
      label: "",
      severity: ''
    },
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
      if (action.payload.resetCurrentOrder) {
        state.currentOrder = {
          _id: "",
          date: new Date(),
          statusChangeDate: null,
          updatedDate: null,
          customerId: 0,
          customer: {},
          items: [],
          totalPrice: 0,
          orderStatusId: 0,
          orderStatus: {
            id: 0,
            name: "",
            label: "",
            severity: ''
          },
        };
      }
      state.currentOrder.customerId = action.payload.customer._id;
      state.currentOrder.customer.name = action.payload.customer.name;
      state.currentOrder.customer.phone = action.payload.customer.phone;
      state.currentOrder.customer.address = action.payload.customer.address;
    },
    openSearchStockItemForOrderPopup: (state, action) => {
      state.searchStockItemForOrderPopup.isShown = true;
    },
    closeSearchStockItemForOrderPopup: (state, action) => {
      state.searchStockItemForOrderPopup.isShown = false;
    },
    openSelectStockItemForOrderPopup: (state, action) => {
      state.selectStockItemForOrderPopup.isShown = true;
    },
    closeSelectStockItemForOrderPopup: (state, action) => {
      _closeSelectStockItemForOrderPopup(state);
    },
    populateSelectStockItemForOrderPopup: (state, action) => {
      state.selectStockItemForOrderPopup.stockItemId =
        action.payload.stockItem._id;
      state.selectStockItemForOrderPopup.stockItemName =
        action.payload.stockItem.name;
      state.selectStockItemForOrderPopup.stockItemPrice =
        action.payload.stockItem.price;
      state.selectStockItemForOrderPopup.stockItemCustomizationsSelectedOptions =
        action.payload.stockItem.customizations.map((customization) => {
          const orderStockItemCustomizationSelectedOption =
            action.payload.orderStockItem?.stockItemCustomizationsSelectedOptions?.find(
              (o) => o.stockItemCustomizationId === customization._id
            ) ?? undefined;
          return {
            stockItemCustomizationId: customization._id,
            stockItemCustomizationName: customization.name,
            stockItemCustomizationSelectedOptionId:
              orderStockItemCustomizationSelectedOption?.stockItemCustomizationSelectedOptionId ??
              0,
            stockItemCustomizationSelectedOptionName:
              orderStockItemCustomizationSelectedOption?.stockItemCustomizationSelectedOptionName ??
              "",
            stockItemCustomizationSelectedOptionAdditionalPrice:
              orderStockItemCustomizationSelectedOption?.stockItemCustomizationSelectedOptionAdditionalPrice ??
              0,
          };
        });

      state.selectStockItemForOrderPopup.amount =
        action.payload.orderStockItem?.amount ?? 0;
      state.selectStockItemForOrderPopup.price =
        action.payload.orderStockItem?.price ?? 0;

      state.selectStockItemForOrderPopup.itemIndexInOrder =
        action.payload.orderStockItem?.itemIndexInOrder ?? null;
    },
    addStockItemToCurrentOrder: (state, action) => {
      const stockItem = _.cloneDeep(state.selectStockItemForOrderPopup);
      delete stockItem.isShown;
      if (stockItem.itemIndexInOrder == null) {
        state.currentOrder.items.push(stockItem);
      } else {
        let _itemIndexInOrder = stockItem.itemIndexInOrder;
        delete stockItem.itemIndexInOrder;
        state.currentOrder.items[_itemIndexInOrder] = stockItem;
      }
      calculateCurrentOrderPrice(state);
      _closeSelectStockItemForOrderPopup(state);
    },
    removeStockItemFromCurrentOrder: (state, action) => {
      state.currentOrder.items.splice(action.payload, 1);
      calculateCurrentOrderPrice(state);
    },
    setSelectStockItemForOrderPopupAmount: (state, action) => {
      state.selectStockItemForOrderPopup.amount = Number(action.payload);
      calculateAndSetSelectStockItemForOrderPopupPrice(state);
    },
    setStockItemCustomizationsSelectedOption: (state, action) => {
      const stockItemCustomizationsSelectedOption =
        state.selectStockItemForOrderPopup.stockItemCustomizationsSelectedOptions.find(
          (o) =>
            o.stockItemCustomizationId ===
            action.payload.stockItemCustomizationId
        );
      if (stockItemCustomizationsSelectedOption) {
        stockItemCustomizationsSelectedOption.stockItemCustomizationSelectedOptionId =
          action.payload.stockItemCustomizationSelectedOptionId;
        stockItemCustomizationsSelectedOption.stockItemCustomizationSelectedOptionName =
          action.payload.stockItemCustomizationSelectedOptionName;
        stockItemCustomizationsSelectedOption.stockItemCustomizationSelectedOptionAdditionalPrice =
          action.payload.stockItemCustomizationSelectedOptionAdditionalPrice;
        calculateAndSetSelectStockItemForOrderPopupPrice(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.currentOrder._id = action.payload._id;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.currentOrder = {
          ..._.cloneDeep(state.currentOrder),
          ...action.payload
        }
      });
  },
});

export const {
  setOrdersSearchTerm,
  setOrderCustomer,
  openSearchStockItemForOrderPopup,
  closeSearchStockItemForOrderPopup,
  openSelectStockItemForOrderPopup,
  closeSelectStockItemForOrderPopup,
  populateSelectStockItemForOrderPopup,
  setSelectStockItemForOrderPopupAmount,
  setStockItemCustomizationsSelectedOption,
  addStockItemToCurrentOrder,
  removeStockItemFromCurrentOrder,
} = ordersSlice.actions;

export const selectOrdersSearchTerm = (state) => state.orders.searchTerm;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectSearchStockItemForOrderPopup = (state) =>
  state.orders.searchStockItemForOrderPopup;
export const selectSelectStockItemForOrderPopup = (state) =>
  state.orders.selectStockItemForOrderPopup;
export const selectOrders = (state) => state.orders.orders;
export const selectOrderStatues = (state) => state.orders.orderSatuses;

export default ordersSlice.reducer;
