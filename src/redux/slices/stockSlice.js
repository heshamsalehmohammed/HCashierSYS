import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addStockItemAPI,
  editStockItemAPI,
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
        thunkAPI.dispatch(fetchStockItems());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

export const editStockItem = createAsyncThunk(
  "stock/editStockItem",
  async (payload, thunkAPI) => {
    const newStockItem = thunkAPI.getState().stock.addStockItemPopup;
    return handleHttpRequestPromise(editStockItemAPI(payload), {
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

export const fetchStockItems = createAsyncThunk(
  "stock/fetchStockItems",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().stock.searchTerm;
    if(!searchTerm){
      return thunkAPI.fulfillWithValue([]);
    }
    return handleHttpRequestPromise(fetchStockItemsAPI({searchTerm}), {
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



/* 

addStockItemCustomizationPopup options

{
  name:"",
  additinalPrice:""
} */


// Define initial state
const initialState = {
  searchTerm: "",
  stockItems: [],
  addStockItemPopup: {
    isShown: false,
    _id: "",
    name: "",
    amount:"",
    price:"",
    customizations:[],
    addStockItemCustomizationPopup:{
      isShown: false,
      _id: "",
      name:"",
      options:[]
    }
  },
};


const _closeAddStockItemCustomizationPopup = (state)=>{
  state.addStockItemPopup.addStockItemCustomizationPopup.isShown = false;
  state.addStockItemPopup.addStockItemCustomizationPopup = {
    isShown: false,
    _id: "",
    options: []
  };
}

const _closeAddStockItemPopup = (state)=>{
  state.addStockItemPopup.isShown = false;
  state.addStockItemPopup = {
    isShown: false,
    _id: "",
    name: "",
    amount:"",
    price:"",
    customizations:[],
    addStockItemCustomizationPopup:{
      isShown: false,
      _id: "",
      name:"",
      options:[]
    }
  };
}


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
    openAddStockItemPopup: (state, action) => {
      state.addStockItemPopup.isShown = true;
    },
    closeAddStockItemPopup: (state, action) => {
      _closeAddStockItemPopup(state)
    },

    openAddStockItemCustomizationPopup: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.isShown = true;
    },
    closeAddStockItemCustomizationPopup: (state, action) => {
      _closeAddStockItemCustomizationPopup(state)
    },
    addStockItemCustomizationName: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.name = action.payload
    },
    addStockItemCustomizationOption: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.options.push({
        _id:"",
        name:"",
        additinalPrice:""
      })
    },
    removeStockItemCustomizationOption: (state, action) => {
      state.addStockItemPopup.addStockItemCustomizationPopup.options.splice(action.payload, 1);
      
    },
    setStockItemCustomizationOptionName: (state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.addStockItemPopup.addStockItemCustomizationPopup.options[index].name = value;
    },
    setStockItemCustomizationOptionAdditionalPrice: (state, action) => {
      const index = action.payload.index;
      const value = action.payload.value;
      state.addStockItemPopup.addStockItemCustomizationPopup.options[index].additionalPrice = value;
    },
    addStockItemCustomization: (state, action) => {
      const newCustomization = _.cloneDeep(state.addStockItemPopup.addStockItemCustomizationPopup);
      state.addStockItemPopup.customizations.push(newCustomization);
      _closeAddStockItemCustomizationPopup(state)
    },
    removeStockItemCustomization: (state, action) => {
      state.addStockItemPopup.customizations.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStockItems.fulfilled, (state, action) => {
      state.stock = action.payload
    });
  },
});

export const {
  setStockSearchTerm,
  setAddStockItemPopupName,
  setAddStockItemPopupAmount,
  setAddStockItemPopupPrice,
  closeAddStockItemPopup,
  openAddStockItemPopup,
  openAddStockItemCustomizationPopup,
  closeAddStockItemCustomizationPopup,
  addStockItemCustomizationName,
  addStockItemCustomizationOption,
  removeStockItemCustomizationOption,
  setStockItemCustomizationOptionName,
  setStockItemCustomizationOptionAdditionalPrice,
  addStockItemCustomization,
  removeStockItemCustomization
} = stockSlice.actions;

export const selectStockSearchTerm = (state) => state.stock.searchTerm;
export const selectAddStockItemPopup = (state) =>
  state.stock.addStockItemPopup;
export const selectAddStockItemCustomizationPopup = (state) =>
  state.stock.addStockItemPopup.addStockItemCustomizationPopup;
export const selectStockItems= (state) => state.stock.stock 

export default stockSlice.reducer;
