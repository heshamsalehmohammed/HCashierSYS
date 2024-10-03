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

export const addStockItem = createAsyncThunk(
  "stock/addStockItem",
  async (payload, thunkAPI) => {
    const newStockItem = _.cloneDeep(
      thunkAPI.getState().stock.addStockItemPopup
    );
    delete newStockItem.isShown;
    delete newStockItem._id;
    delete newStockItem.addStockItemCustomizationPopup;
    newStockItem.customizations.forEach((customization) => {
      delete customization._id;
      delete customization.isShown;
      customization.options.forEach((option) => {
        delete option._id;
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
    delete newStockItem.addStockItemCustomizationPopup;
    newStockItem.customizations.forEach((customization) => {
      delete customization._id;
      delete customization.isShown;
      customization.options.forEach((option) => {
        delete option._id;
      });
    });
    return handleHttpRequestPromise(editStockItemAPI(id, newStockItem), {
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
        title: "Error add StockItem",
        message:
          "An unexpected error occurred, Cannot add StockItem at thee moment. ",
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
        title: "Error add StockItem",
        message:
          "An unexpected error occurred, Cannot add StockItem at thee moment. ",
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
        title: "Error add StockItem",
        message:
          "An unexpected error occurred, Cannot add StockItem at thee moment. ",
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

export const prepareAndopenAddStockItemPopup = createAsyncThunk(
  "stock/prepareAndopenAddStockItemPopup",
  async (payload, thunkAPI) => {
    if (payload) {
      const stockItem = await thunkAPI.dispatch(fetchStockItem(payload));
      thunkAPI.dispatch(populateAddStockItemPopup(stockItem.payload));
    } else {
      thunkAPI.dispatch(openAddStockItemPopup());
    }
  }
);

/* 
addStockItemCustomizationPopup options
{
  name:"",
  additionalPrice:""
} */

// Define initial state
const initialState = {
  searchTerm: "",
  stockItems: [],
  addStockItemPopup: {
    isShown: false,
    _id: "",
    name: "",
    amount: 0,
    price: 0,
    customizations: [],
    addStockItemCustomizationPopup: {
      isShown: false,
      _id: "",
      name: "",
      options: [],
    },
  },
};

const _closeAddStockItemCustomizationPopup = (state) => {
  state.addStockItemPopup.addStockItemCustomizationPopup.isShown = false;
  state.addStockItemPopup.addStockItemCustomizationPopup = {
    isShown: false,
    _id: "",
    options: [],
  };
};

const _closeAddStockItemPopup = (state) => {
  state.addStockItemPopup.isShown = false;
  state.addStockItemPopup = {
    isShown: false,
    _id: "",
    name: "",
    amount: 0,
    price: 0,
    customizations: [],
    addStockItemCustomizationPopup: {
      isShown: false,
      _id: "",
      name: "",
      options: [],
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
      state.addStockItemPopup.amount = Number(action.payload);
    },
    setAddStockItemPopupPrice: (state, action) => {
      state.addStockItemPopup.price = Number(action.payload);
    },
    populateAddStockItemPopup: (state, action) => {
      state.addStockItemPopup.isShown = true;
      state.addStockItemPopup._id = action.payload._id;
      state.addStockItemPopup.amount = action.payload.amount;
      state.addStockItemPopup.name = action.payload.name;
      state.addStockItemPopup.price = action.payload.price;
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
      if (action.payload >= 0) {
        state.addStockItemPopup.addStockItemCustomizationPopup.options =
          state.addStockItemPopup.customizations[action.payload].options;
        state.addStockItemPopup.addStockItemCustomizationPopup.name =
          state.addStockItemPopup.customizations[action.payload].name;
        state.addStockItemPopup.addStockItemCustomizationPopup._id =
          state.addStockItemPopup.customizations[action.payload]._id;
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
        additionalPrice: 0,
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
      ].additionalPrice = Number(value);
    },
    addStockItemCustomization: (state, action) => {
      const newCustomization = _.cloneDeep(
        state.addStockItemPopup.addStockItemCustomizationPopup
      );

      const existingCustomizationIndex =
        state.addStockItemPopup.customizations.findIndex(
          (customization) => customization._id === newCustomization._id
        );

      if (existingCustomizationIndex >= 0) {
        state.addStockItemPopup.customizations[existingCustomizationIndex] =
          newCustomization;
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
    builder.addCase(fetchStockItems.fulfilled, (state, action) => {
      state.stock = action.payload;
    });
  },
});

export const {
  setStockSearchTerm,
  setAddStockItemPopupName,
  setAddStockItemPopupAmount,
  setAddStockItemPopupPrice,
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
export const selectStockItems = (state) => state.stock.stock;

export default stockSlice.reducer;
