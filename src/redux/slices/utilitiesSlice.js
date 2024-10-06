import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { closeWebSocket, initWebSocketConnection } from "../../services/webSocketManager";

export const initWebSocket = createAsyncThunk(
  'utilities/initWebSocket',
  async ({ maxRetries = 5, retryDelay = 1000 }, { dispatch }) => {
    let attempts = 0;
    let sessionId = sessionStorage.getItem('sessionId');

    dispatch(startLoading());

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Cannot initialize WebSocket connection.');
      dispatch(stopLoading()); // Stop loading since we cannot proceed
      return Promise.reject('No token found');
    }

    const attemptConnection = async () => {
      while (attempts < maxRetries) {
        try {
          await initWebSocketConnection({
            token,
            sessionId,
            dispatch,
            onMessage: (data) => {
              if (data.type === 'action') {
                // Handle action messages
                const { reduxActionToBeDispatched, reduxActionPayloadToBeSent } = data;
        
                // Check if the action is allowed
                dispatch({ type: reduxActionToBeDispatched, payload: reduxActionPayloadToBeSent });
              }
            },
          });
          dispatch(socketInitialized());
          dispatch(stopLoading());
          break; // Connection successful, break the loop
        } catch (error) {
          attempts++;
          console.log(
            `Retry attempt ${attempts}/${maxRetries} after ${retryDelay}ms`
          );
          if (attempts < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else {
            console.error(
              'Max retry attempts reached. Could not establish WebSocket connection.'
            );
            dispatch(stopLoading()); // Stop loading if we have failed after max retries
          }
        }
      }
    };

    await attemptConnection();
  }
);

// Thunk action to close the WebSocket
export const closeSocket = () => (dispatch) => {
  closeWebSocket(); // Close the WebSocket connection
  dispatch(socketClosed()); // Update the state
};

// Define initial state
const initialState = {
  loading: 0,
  lang: localStorage.getItem('appLanguage') || 'en',
  popup: {
    isDisplayed: false,
    type: '',
    title: '',
    message: '',
    multiMessages: [],
    headers: [],
    buttonLabel: '',
  },
  errorPopup: {
    isDisplayed: false,
    title: '',
    body: '',
  },
  confirmationPopup: {
    isDisplayed: false,
    actionName: '',
    actionMessage: '',
    confirmCallback: null,
    declineCallback: null,
    confirmationButtonText: '',
    cancelText: '',
    closable: false,
    confirmationButtonProps: {},
  },
  toast:{
    toastMessage: null,
    toastSeverity: 'info',
    toastSummary: 'Info',
  },
  socketInitialized: false,
};

const utilitiesSlice = createSlice({
  name: 'utilities',
  initialState: initialState,
  reducers: {
    startLoading: (state) => {
      state.loading += 1;
    },
    stopLoading: (state) => {
      state.loading = Math.max(0, state.loading - 1);
    },
    showToast: (state, action) => {
      const { message, severity, summary } = action.payload;
      state.toast.toastMessage = message;
      state.toast.toastSeverity = severity || 'info'; // Default to 'info'
      state.toast.toastSummary = summary || 'Info';  // Default to 'Info'
    },
    clearToastMessage: (state) => {
      state.toast.toastMessage = null;
      state.toast.toastSeverity = 'info';
      state.toast.toastSummary = 'Info';
    },
    openPopup: (state, action) => {
      const payload = action.payload;
      state.popup = {
        isDisplayed: true,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        multiMessages: payload.multiMessages,
        headers: payload.headers,
        buttonLabel: payload.buttonLabel,
      };
    },
    closePopup: (state) => {
      state.popup.isDisplayed = false;
    },
    openErrorPopup: (state, action) => {
      const payload = action.payload;
      state.errorPopup = {
        isDisplayed: true,
        title: payload.title,
        body: payload.body,
      };
    },
    closeErrorPopup: (state) => {
      state.errorPopup.isDisplayed = false;
    },
    openConfirmationPopup: (state, action) => {
      const payload = action.payload;
      state.confirmationPopup = {
        isDisplayed: true,
        actionName: payload.actionName,
        actionMessage: payload.actionMessage,
        confirmCallback: payload.confirmCallback,
        declineCallback: payload.declineCallback,
        confirmationButtonText: payload.confirmationButtonText,
        cancelText: payload.cancelText,
        closable: payload.closable,
        confirmationButtonProps: payload.confirmationButtonProps,
      };
    },
    closeConfirmationPopup: (state) => {
      state.confirmationPopup.isDisplayed = false;
    },
    changeLanguage: (state, action) => {
      const newLang = action.payload;
      state.lang = newLang;
      localStorage.setItem('appLanguage', newLang); // Persist language to localStorage
    },
    socketInitialized: (state) => {
      state.socketInitialized = true;
    },
    socketClosed: (state) => {
      state.socketInitialized = false;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  openPopup,
  closePopup,
  openErrorPopup,
  closeErrorPopup,
  openConfirmationPopup,
  closeConfirmationPopup,
  changeLanguage,
  socketInitialized,
  socketClosed,
  showToast,
  clearToastMessage
} = utilitiesSlice.actions;

export const selectLanguage = (state) => state.utilities.lang;

export default utilitiesSlice.reducer;
