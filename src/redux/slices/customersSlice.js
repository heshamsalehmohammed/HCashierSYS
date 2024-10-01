import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  searchTerm: "",
  customers: [],
  addCustomerPopup: {
    isShown: false,
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
});

export const {
  setSearchTerm,
  setAddCustomerPopupName,
  setAddCustomerPopupPhone,
  setAddCustomerPopupAddress,
  closeAddCustomerPopupAddress,
  openAddCustomerPopupAddress
} = customersSlice.actions;

export const selectSearchTerm = (state) => state.customers.searchTerm;
export const selectAddCustomerPopup = (state) => state.customers.addCustomerPopup;

export default customersSlice.reducer;
