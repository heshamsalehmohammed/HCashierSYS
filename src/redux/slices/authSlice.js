import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginAPI, logoutAPI, registerAPI } from '../../api/authAPI';
import { handleHttpRequestPromise } from '../../services/HTTPRequestHandler';
import { closeSocket } from './utilitiesSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(clearAuthError());
    return handleHttpRequestPromise(loginAPI(payload), {
      type: 'openPopup',
      showForStatuses: '500,404,501',
      payload: {
        type: 'Error',
        title: 'Error logging in',
        message: 'An unexpected error occurred, cannot log in at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then((result) => {
        const { token, user } = result.data;
        localStorage.setItem('token', token); // Store JWT token
        return thunkAPI.fulfillWithValue({ user });
      })
      .catch((error) => {
        if ([400, 401].includes(error.response.status))
          return thunkAPI.rejectWithValue(error.response.data);
        return thunkAPI.abort();
      });
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    return handleHttpRequestPromise(logoutAPI(), {
      type: 'openPopup',
      showForStatuses: 'all',
      payload: {
        type: 'Error',
        title: 'Error logging out',
        message: 'An unexpected error occurred, cannot log out at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(async (result) => {
        await thunkAPI.dispatch(closeSocket());
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        return thunkAPI.rejectWithValue(error.response.data);
      });
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    return handleHttpRequestPromise(registerAPI(userData), {
      type: 'openPopup',
      showForStatuses: '500,404,501',
      payload: {
        type: 'Error',
        title: 'Error registering user',
        message: 'An unexpected error occurred, cannot register at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then((result) => {
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch((error) => {
        if ([400, 401].includes(error.response.status))
          return thunkAPI.rejectWithValue(error.response.data);
        return thunkAPI.abort();
      });
  }
);

const initialState = {
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Store user data in state
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        localStorage.removeItem('token'); // Remove JWT token on logout
        sessionStorage.removeItem('sessionId'); // Remove sessionId on logout
        state.user = null; // Clear user data
        
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Optional handling for rejected logout
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        localStorage.setItem('token', token); // Store JWT token
        state.user = user; // Set registered user data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload; // Set error on registration failure
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
