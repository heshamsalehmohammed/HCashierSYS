import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addStockItemAPI,
  deleteStockItemAPI,
  editStockItemAPI,
  fetchStockItemAPI,
  fetchStockItemsAPI,
} from "../../api/stockAPI";
import _ from "lodash";
import { populateSelectStockItemForOrderPopup } from "./ordersSlice";
import { showToast } from "./utilitiesSlice";
import { updateHomePage } from "./statisticsSlice";

export const addStockItem = createAsyncThunk(
  "stock/addStockItem",
  async (payload, thunkAPI) => {
    const newStockItem = _.cloneDeep(
      thunkAPI.getState().stock.addStockItemPopup
    );
    delete newStockItem.isShown;
    delete newStockItem._id;
    delete newStockItem.__v;
    delete newStockItem.addStockItemCustomizationPopup;
    newStockItem.amount = Number(newStockItem.amount)
    newStockItem.price = Number(newStockItem.price)
    newStockItem.customizations.forEach((customization) => {
      delete customization._id;
      delete customization.__v;
      delete customization.isShown;
      delete customization.indexOfCustomization;
      customization.options.forEach((option) => {
        delete option._id;
        delete option.__v;
        option.additionalPrice = Number(option.additionalPrice)
      });
    });
    return handleHttpRequestPromise(addStockItemAPI(newStockItem), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error add StockItem",
        message:
          "An unexpected error occurred, Cannot add StockItem at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(closeAddStockItemPopup());
        thunkAPI.dispatch(fetchStockItems());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      })
      .finally(() => {});
  }
);

export const editStockItem = createAsyncThunk(
  "stock/editStockItem",
  async (payload, thunkAPI) => {
    const newStockItem = _.cloneDeep(
      thunkAPI.getState().stock.addStockItemPopup
    );
    const id = newStockItem._id;
    delete newStockItem.isShown;
    delete newStockItem._id;
    delete newStockItem.__v;
    delete newStockItem.addStockItemCustomizationPopup;
    newStockItem.amount = Number(newStockItem.amount)
    newStockItem.price = Number(newStockItem.price)
    newStockItem.customizations.forEach((customization) => {
      delete customization._id;
      delete customization.__v;
      delete customization.isShown;
      delete customization.indexOfCustomization;
      customization.options.forEach((option) => {
        delete option._id;
        delete option.__v;
        option.additionalPrice = Number(option.additionalPrice)
      });
    });
    return handleHttpRequestPromise(editStockItemAPI(id, newStockItem), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error edit StockItem",
        message:
          "An unexpected error occurred, Cannot edit StockItem at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(closeAddStockItemPopup());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

export const deleteStockItem = createAsyncThunk(
  "stock/deleteStockItem",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(deleteStockItemAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error delete StockItem",
        message:
          "An unexpected error occurred, Cannot delete StockItem at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(fetchStockItems());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

export const fetchStockItems = createAsyncThunk(
  "stock/fetchStockItems",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().stock.searchTerm;
    return handleHttpRequestPromise(fetchStockItemsAPI({ searchTerm }), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error fetch StockItems",
        message:
          "An unexpected error occurred, Cannot fetch StockItems at thee moment. ",
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

export const fetchStockItem = createAsyncThunk(
  "stock/fetchStockItem",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(fetchStockItemAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error fetch StockItem",
        message:
          "An unexpected error occurred, Cannot fetch StockItem at thee moment. ",
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

export const fetchStockItemBackendAction = createAsyncThunk(
  "stock/fetchStockItemBackendAction",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(fetchStockItemAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,500,404,501",
      payload: {
        type: "Error",
        title: "Error fetch StockItem",
        message:
          "An unexpected error occurred, Cannot fetch StockItem at thee moment. ",
        buttonLabel: "OK",
      },
    })
      .then((result) => {


        const newStockItem = result.data;
        const state = thunkAPI.getState();
        if(state.orders.selectStockItemForOrderPopup.isShown){
          
          const currentOrder = state.orders.currentOrder;
          const currentOrderItemIndex = currentOrder.items.findIndex(oi=> oi.stockItemId == newStockItem._id);


          thunkAPI.dispatch(populateAddStockItemPopup(newStockItem));
          thunkAPI.dispatch(
            populateSelectStockItemForOrderPopup({
              stockItem: newStockItem,
              orderStockItem: {
                ...currentOrder.items[currentOrderItemIndex],
                itemIndexInOrder: currentOrderItemIndex,
              },
            })
          );
        }


        thunkAPI.dispatch(showToast({
          message: `Item ${newStockItem.name} has been modified from other session`,
          severity: 'info',
          summary: 'Info'
        }))

        thunkAPI.dispatch(updateHomePage())
        return thunkAPI.fulfillWithValue(newStockItem);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

export const prepareAndopenAddStockItemPopup = createAsyncThunk(
  "stock/prepareAndopenAddStockItemPopup",
  async (payload, thunkAPI) => {
    if (payload) {
      let stockItemPayload = null;
      const stockItems = thunkAPI.getState().stock.stockItems;
      const stockItemInState = stockItems.find((si) => si._id == payload);
      if (stockItemInState) {
        stockItemPayload = stockItemInState;
      } else {
        const stockItem = await thunkAPI.dispatch(fetchStockItem(payload));
        stockItemPayload = stockItem.payload;
      }

      thunkAPI.dispatch(populateAddStockItemPopup(stockItemPayload));
    }
    thunkAPI.dispatch(openAddStockItemPopup());
  }
);

// Define initial state
const initialState = {
  searchTerm: "",
  stockItems: [],
  addStockItemPopup: {
    isShown: false,
    _id: "",
    name: "",
    amount: '',
    canOrderByCount: false,
    price: '',
    customizations: [],
    addStockItemCustomizationPopup: {
      isShown: false,
      _id: "",
      name: "",
      options: [],
      indexOfCustomization: null,
    },
  },
};

const _closeAddStockItemCustomizationPopup = (state) => {
  state.addStockItemPopup.addStockItemCustomizationPopup.isShown = false;
  state.addStockItemPopup.addStockItemCustomizationPopup = {
    isShown: false,
    _id: "",
    name: "",
    options: [],
    indexOfCustomization: null,
  };
};

const _closeAddStockItemPopup = (state) => {
  state.addStockItemPopup.isShown = false;
  state.addStockItemPopup = {
    isShown: false,
    _id: "",
    name: "",
    amount: '',
    price: '',
    canOrderByCount: false,
    customizations: [],
    addStockItemCustomizationPopup: {
      isShown: false,
      _id: "",
      name: "",
      options: [],
      indexOfCustomization: null,
    },
  };
};

const stockSlice = createSlice({
  name: "stock",
  initialState: initialState,
  reducers: {
    setStockSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setAddStockItemPopupName: (state, action) => {
      state.addStockItemPopup.name = action.payload;
    },
    setAddStockItemPopupAmount: (state, action) => {
      state.addStockItemPopup.amount = action.payload;
    },
    setAddStockItemPopupPrice: (state, action) => {
      state.addStockItemPopup.price = action.payload;
    },
    setAddStockItemPopupCanOrderByCount: (state, action)=>{
      state.addStockItemPopup.canOrderByCount = Boolean(action.payload)
    },
    populateAddStockItemPopup: (state, action) => {
      state.addStockItemPopup._id = action.payload._id;
      state.addStockItemPopup.amount = action.payload.amount;
      state.addStockItemPopup.name = action.payload.name;
      state.addStockItemPopup.price = action.payload.price;
      state.addStockItemPopup.canOrderByCount = action.payload.canOrderByCount;
      state.addStockItemPopup.customizations = action.payload.customizations;
    },
    openAddStockItemPopup: (state, action) => {
      state.addStockItemPopup.isShown = true;
    },
    closeAddStockItemPopup: (state, action) => {
      _closeAddStockItemPopup(state);
    },

    openAddStockItemCustomizationPopup: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.isShown = true;
      if (action.payload != null) {
        state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization =
          action.payload;

        state.addStockItemPopup.addStockItemCustomizationPopup.options =
          state.addStockItemPopup.customizations[
            state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
          ].options;
        state.addStockItemPopup.addStockItemCustomizationPopup.name =
          state.addStockItemPopup.customizations[
            state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
          ].name;
        state.addStockItemPopup.addStockItemCustomizationPopup._id =
          state.addStockItemPopup.customizations[
            state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
          ]._id;
      }
    },
    closeAddStockItemCustomizationPopup: (state, action) => {
      _closeAddStockItemCustomizationPopup(state);
    },
    addStockItemCustomizationName: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.name =
        action.payload;
    },
    addStockItemCustomizationOption: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.options.push({
        _id: "",
        name: "",
        additionalPrice: '',
      });
    },
    removeStockItemCustomizationOption: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.options.splice(
        action.payload,
        1
      );
    },
    setStockItemCustomizationOptionName: (state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.addStockItemPopup.addStockItemCustomizationPopup.options[
        index
      ].name = value;
    },
    setStockItemCustomizationOptionAdditionalPrice: (state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.addStockItemPopup.addStockItemCustomizationPopup.options[
        index
      ].additionalPrice = value;
    },
    addStockItemCustomization: (state, action) => {
      const newCustomization = _.cloneDeep(
        state.addStockItemPopup.addStockItemCustomizationPopup
      );

      if (newCustomization.indexOfCustomization != null) {
        state.addStockItemPopup.customizations[
          newCustomization.indexOfCustomization
        ] = newCustomization;
      } else {
        state.addStockItemPopup.customizations.push(newCustomization);
      }
      _closeAddStockItemCustomizationPopup(state);
    },
    removeStockItemCustomization: (state, action) => {
      state.addStockItemPopup.customizations.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockItems.fulfilled, (state, action) => {
        state.stockItems = action.payload;
      })
      .addCase(editStockItem.fulfilled, (state, action) => {
        const indexInStockItems = state.stockItems.findIndex(
          (si) => si._id == action.payload._id
        );
        if (indexInStockItems != -1) {
          state.stockItems[indexInStockItems] = action.payload;
        }
      })
      .addCase(addStockItem.fulfilled, (state, action) => {
        state.stockItems.push(action.payload);
      })
      .addCase(fetchStockItemBackendAction.fulfilled, (state, action) => {
        // update the item in stockItems
        const indexInStockItems = state.stockItems.findIndex(
          (si) => si._id == action.payload._id
        );
        if (indexInStockItems != -1) {
          state.stockItems[indexInStockItems] = action.payload;
        }
        // update the item in the addStockItemPopup
        if (
          state.addStockItemPopup.isShown &&
          state.addStockItemPopup._id == action.payload._id
        ) {
          state.addStockItemPopup.amount = action.payload.amount;
          state.addStockItemPopup.name = action.payload.name;
          state.addStockItemPopup.price = action.payload.price;
          state.addStockItemPopup.canOrderByCount = action.payload.canOrderByCount;
          state.addStockItemPopup.customizations =
            action.payload.customizations;

          if (
            state.addStockItemPopup.addStockItemCustomizationPopup.isShown &&
            state.addStockItemPopup.addStockItemCustomizationPopup
              .indexOfCustomization != null
          ) {
            state.addStockItemPopup.addStockItemCustomizationPopup.options =
              state.addStockItemPopup.customizations[
                state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
              ].options;
            state.addStockItemPopup.addStockItemCustomizationPopup.name =
              state.addStockItemPopup.customizations[
                state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
              ].name;
            state.addStockItemPopup.addStockItemCustomizationPopup._id =
              state.addStockItemPopup.customizations[
                state.addStockItemPopup.addStockItemCustomizationPopup.indexOfCustomization
              ]._id;
          }
        }
      });
  },
});

export const {
  setStockSearchTerm,
  setAddStockItemPopupName,
  setAddStockItemPopupAmount,
  setAddStockItemPopupPrice,
  setAddStockItemPopupCanOrderByCount,
  closeAddStockItemPopup,
  populateAddStockItemPopup,
  openAddStockItemPopup,
  openAddStockItemCustomizationPopup,
  closeAddStockItemCustomizationPopup,
  addStockItemCustomizationName,
  addStockItemCustomizationOption,
  removeStockItemCustomizationOption,
  setStockItemCustomizationOptionName,
  setStockItemCustomizationOptionAdditionalPrice,
  addStockItemCustomization,
  removeStockItemCustomization,
} = stockSlice.actions;

export const selectStockSearchTerm = (state) => state.stock.searchTerm;
export const selectAddStockItemPopup = (state) => state.stock.addStockItemPopup;
export const selectAddStockItemCustomizationPopup = (state) =>
  state.stock.addStockItemPopup.addStockItemCustomizationPopup;
export const selectStockItems = (state) => state.stock.stockItems;

export default stockSlice.reducer;
