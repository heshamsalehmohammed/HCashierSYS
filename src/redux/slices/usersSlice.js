import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  searchTerm: "",
  users: [],
  addUserPopup: {
    isShown: false,
    name: "",
    phone: "",
    address: "",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setAddUserPopupName: (state, action) => {
      state.addUserPopup.name = action.payload;
    },
    setAddUserPopupPhone: (state, action) => {
      state.addUserPopup.phone = action.payload;
    },
    setAddUserPopupAddress: (state, action) => {
      state.addUserPopup.address = action.payload;
    },
    openAddUserPopupAddress: (state, action) => {
      state.addUserPopup.isShown = true;
    },
    closeAddUserPopupAddress: (state, action) => {
      state.addUserPopup.isShown = false;
    },
  },
});

export const {
  setSearchTerm,
  setAddUserPopupName,
  setAddUserPopupPhone,
  setAddUserPopupAddress,
  closeAddUserPopupAddress,
  openAddUserPopupAddress
} = usersSlice.actions;

export const selectSearchTerm = (state) => state.users.searchTerm;
export const selectAddUserPopup = (state) => state.users.addUserPopup;

export default usersSlice.reducer;
