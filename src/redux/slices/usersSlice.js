import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";
import {
  addUserAPI,
  deleteUserAPI,
  editUserAPI,
  fetchUserAPI,
  fetchUsersAPI,
} from "../../api/usersAPI";
import _ from "lodash";

/** Async Actions **/

// Fetch Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (payload, thunkAPI) => {
    const searchTerm = thunkAPI.getState().users.searchTerm;
    return handleHttpRequestPromise(fetchUsersAPI({ searchTerm }), {
      type: "openPopup",
      showForStatuses: "400,401,403,404,500",
      payload: {
        type: "Error",
        title: "Error fetching users",
        message:
          "An unexpected error occurred. Cannot fetch users at the moment.",
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

// Add User
export const addUser = createAsyncThunk(
  "users/addUser",
  async (payload, thunkAPI) => {
    const newUser = _.cloneDeep(thunkAPI.getState().users.addUserPopup);
    delete newUser.isShown;
    delete newUser._id;
    delete newUser.__v;

    return handleHttpRequestPromise(addUserAPI(newUser), {
      type: "openPopup",
      showForStatuses: "400,401,403,404,500",
      payload: {
        type: "Error",
        title: "Error adding user",
        message:
          "An unexpected error occurred. Cannot add user at the moment.",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(fetchUsers());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

// Edit User
export const editUser = createAsyncThunk(
  "users/editUser",
  async (payload, thunkAPI) => {
    const newUser = _.cloneDeep(thunkAPI.getState().users.addUserPopup);
    const id = newUser._id;
    delete newUser.isShown;
    delete newUser._id;
    delete newUser.__v;

    return handleHttpRequestPromise(editUserAPI(id, newUser), {
      type: "openPopup",
      showForStatuses: "400,401,403,404,500",
      payload: {
        type: "Error",
        title: "Error editing user",
        message:
          "An unexpected error occurred. Cannot edit user at the moment.",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(closeAddUserPopup());
        thunkAPI.dispatch(fetchUsers());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(deleteUserAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,403,404,500",
      payload: {
        type: "Error",
        title: "Error deleting user",
        message:
          "An unexpected error occurred. Cannot delete user at the moment.",
        buttonLabel: "OK",
      },
    })
      .then((result) => {
        thunkAPI.dispatch(fetchUsers());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.abort();
      });
  }
);

// Fetch User by ID
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (payload, thunkAPI) => {
    return handleHttpRequestPromise(fetchUserAPI(payload), {
      type: "openPopup",
      showForStatuses: "400,401,403,404,500",
      payload: {
        type: "Error",
        title: "Error fetching user",
        message:
          "An unexpected error occurred. Cannot fetch user at the moment.",
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

// Prepare and Open Add User Popup
export const prepareAndOpenAddUserPopup = createAsyncThunk(
  "users/prepareAndOpenAddUserPopup",
  async (payload, thunkAPI) => {
    if (payload) {
      const user = await thunkAPI.dispatch(fetchUser(payload));
      thunkAPI.dispatch(populateAddUserPopup(user.payload));
    } else {
      thunkAPI.dispatch(openAddUserPopup());
    }
  }
);

/** Initial State **/
const initialState = {
  searchTerm: "",
  users: [],
  addUserPopup: {
    isShown: false,
    _id: "",
    name: "",
    email: "",
    role: "user",
    password: "",
  },
};

/** Slice **/
const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    // Set search term
    setUsersSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    // Set fields in Add User Popup
    setAddUserPopupName: (state, action) => {
      state.addUserPopup.name = action.payload;
    },
    setAddUserPopupEmail: (state, action) => {
      state.addUserPopup.email = action.payload;
    },
    setAddUserPopupRole: (state, action) => {
      state.addUserPopup.role = action.payload;
    },
    setAddUserPopupPassword: (state, action) => {
      state.addUserPopup.password = action.payload;
    },
    // Populate Add User Popup with user data
    populateAddUserPopup: (state, action) => {
      state.addUserPopup.isShown = true;
      state.addUserPopup._id = action.payload._id;
      state.addUserPopup.name = action.payload.name;
      state.addUserPopup.email = action.payload.email;
      state.addUserPopup.role = action.payload.role;
      state.addUserPopup.password = ""; // Do not pre-fill password
    },
    // Open and Close Add User Popup
    openAddUserPopup: (state) => {
      state.addUserPopup.isShown = true;
    },
    closeAddUserPopup: (state) => {
      state.addUserPopup = {
        isShown: false,
        _id: "",
        name: "",
        email: "",
        role: "user",
        password: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addUserPopup._id = action.payload._id;
      });
  },
});

/** Actions **/
export const {
  setUsersSearchTerm,
  setAddUserPopupName,
  setAddUserPopupEmail,
  setAddUserPopupRole,
  setAddUserPopupPassword,
  populateAddUserPopup,
  openAddUserPopup,
  closeAddUserPopup,
} = usersSlice.actions;

/** Selectors **/
export const selectUsersSearchTerm = (state) => state.users.searchTerm;
export const selectAddUserPopup = (state) => state.users.addUserPopup;
export const selectUsers = (state) => state.users.users;

/** Reducer **/
export default usersSlice.reducer;
