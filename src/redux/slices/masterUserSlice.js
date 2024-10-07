// redux/slices/masterUserSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchUsersSessionsAPI,
  sendBroadCastAPI,
  sendMessageToSessionAPI,
  sendMessageToUserSessionsAPI,
  terminateSessionAPI,
  terminateUserSessionsAPI,
} from '../../api/masterUserAPI';
import { handleHttpRequestPromise } from '../../services/HTTPRequestHandler';

// Initial state
const initialState = {
  users: [],
  searchTerm: '',
  masterMessagePopup: {
    type: '',
    forDetails: {
      userId: null,
      sessionId: null,
    },
    action: {
      actionName: '',
      actionPayload: '',
    },
    toast: {
      toastSeverity: '',
      toastSummary: '',
      toastMessage: '',
    },
    isShown: false,
  },
};

// Async actions

// Fetch users and sessions
export const fetchUsersSessions = createAsyncThunk(
  'masterUser/fetchUsersSessions',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const searchTerm = state.masterUser.searchTerm;
    const criteria = {}; // Add searchTerm to criteria if needed

    return handleHttpRequestPromise(fetchUsersSessionsAPI(criteria), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error fetching user sessions',
        message:
          'An unexpected error occurred, cannot fetch user sessions at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then((result) => {
        return thunkAPI.fulfillWithValue(result.data);
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);

// Terminate a session
export const terminateSession = createAsyncThunk(
  'masterUser/terminateSession',
  async (sessionId, thunkAPI) => {
    return handleHttpRequestPromise(terminateSessionAPI(sessionId), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error terminating session',
        message:
          'An unexpected error occurred, cannot terminate session at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(() => {
        return thunkAPI.fulfillWithValue(sessionId);
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);

// Terminate all user's sessions
export const terminateUserSessions = createAsyncThunk(
  'masterUser/terminateUserSessions',
  async (userId, thunkAPI) => {
    return handleHttpRequestPromise(terminateUserSessionsAPI(userId), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error terminating user sessions',
        message:
          'An unexpected error occurred, cannot terminate user sessions at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(() => {
        return thunkAPI.fulfillWithValue(userId);
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);


export const sendBroadCast = createAsyncThunk(
  'masterUser/sendMessageToSession',
  async ({ message }, thunkAPI) => {
    return handleHttpRequestPromise(sendBroadCastAPI({ message }), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error sending message to session',
        message:
          'An unexpected error occurred, cannot send message to session at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(() => {
        return thunkAPI.fulfillWithValue({ message });
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);


// Send message to a session
export const sendMessageToSession = createAsyncThunk(
  'masterUser/sendMessageToSession',
  async ({ sessionId, message }, thunkAPI) => {
    return handleHttpRequestPromise(sendMessageToSessionAPI({ sessionId, message }), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error sending message to session',
        message:
          'An unexpected error occurred, cannot send message to session at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(() => {
        return thunkAPI.fulfillWithValue({ sessionId, message });
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);

// Send message to all user's sessions
export const sendMessageToUserSessions = createAsyncThunk(
  'masterUser/sendMessageToUserSessions',
  async ({ userId, message }, thunkAPI) => {
    return handleHttpRequestPromise(sendMessageToUserSessionsAPI({ userId, message }), {
      thunkAPI,
      type: 'openPopup',
      showForStatuses: '400,401,500,404,501',
      payload: {
        type: 'Error',
        title: 'Error sending message to user sessions',
        message:
          'An unexpected error occurred, cannot send message to user sessions at the moment.',
        buttonLabel: 'OK',
      },
    })
      .then(() => {
        return thunkAPI.fulfillWithValue({ userId, message });
      })
      .catch(() => {
        return thunkAPI.rejectWithValue();
      });
  }
);

// Slice
const masterUserSlice = createSlice({
  name: 'masterUser',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    openMasterMessagePopup: (state, action) => {
      const { userId, sessionId } = action.payload;
      state.masterMessagePopup.forDetails.userId = userId || null;
      state.masterMessagePopup.forDetails.sessionId = sessionId || null;
      state.masterMessagePopup.isShown = true;
      state.masterMessagePopup.type = '';
      state.masterMessagePopup.action = {
        actionName: '',
        actionPayload: '',
      };
      state.masterMessagePopup.toast = {
        toastSeverity: '',
        toastSummary: '',
        toastMessage: '',
      };
    },
    closeMasterMessagePopup: (state) => {
      state.masterMessagePopup.isShown = false;
    },
    setMasterMessagePopupType: (state, action) => {
      state.masterMessagePopup.type = action.payload;
    },
    setMasterMessagePopupActionName: (state, action) => {
      state.masterMessagePopup.action.actionName = action.payload;
    },
    setMasterMessagePopupActionPayload: (state, action) => {
      state.masterMessagePopup.action.actionPayload = action.payload;
    },
    setMasterMessagePopupToastSeverity: (state, action) => {
      state.masterMessagePopup.toast.toastSeverity = action.payload;
    },
    setMasterMessagePopupToastSummary: (state, action) => {
      state.masterMessagePopup.toast.toastSummary = action.payload;
    },
    setMasterMessagePopupToastMessage: (state, action) => {
      state.masterMessagePopup.toast.toastMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersSessions.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(terminateSession.fulfilled, (state, action) => {
        const sessionId = action.payload;
        state.users.forEach((user) => {
          user.sessions.forEach((session) => {
            if (session.sessionId === sessionId) {
              session.connected = false;
            }
          });
        });
      })
      .addCase(terminateUserSessions.fulfilled, (state, action) => {
        const userId = action.payload;
        state.users = state.users.map((user) => {
          if (user._id === userId) {
            const updatedSessions = user.sessions.map((session) => ({
              ...session,
              connected: false,
            }));
            return { ...user, sessions: updatedSessions };
          }
          return user;
        });
      });
  },
});

// Selectors
export const selectUsers = (state) => state.masterUser.users;
export const selectSearchTerm = (state) => state.masterUser.searchTerm;
export const selectMasterMessagePopup = (state) =>
  state.masterUser.masterMessagePopup;

// Actions
export const {
  setSearchTerm,
  openMasterMessagePopup,
  closeMasterMessagePopup,
  setMasterMessagePopupType,
  setMasterMessagePopupActionName,
  setMasterMessagePopupActionPayload,
  setMasterMessagePopupToastSeverity,
  setMasterMessagePopupToastSummary,
  setMasterMessagePopupToastMessage,
} = masterUserSlice.actions;

export default masterUserSlice.reducer;
