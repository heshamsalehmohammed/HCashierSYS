import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleHttpRequestPromise } from "../../services/HTTPRequestHandler";

export const initWebSocket = createAsyncThunk(
  'utilities/initWebSocket',
  async ({ maxRetries = 5, retryDelay = 1000 }, { dispatch }) => {
    let attempts = 0;
    let sessionId = sessionStorage.getItem('sessionId'); // Use sessionStorage instead of localStorage

    // Dispatch startLoading before attempting connection
    dispatch(startLoading());

    const connectSocket = () => {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found. Cannot initialize WebSocket connection.');
          dispatch(stopLoading()); // Stop loading since we cannot proceed
          return reject('No token found');
        }
        const wsUrl = `${process.env.REACT_APP_API_ENDPOINT_WEBSOCKET_PREFIX}?token=${token}${
          sessionId ? `&sessionId=${sessionId}` : ''
        }`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connection opened.');
          dispatch(openSocket(socket));
          dispatch(stopLoading()); // Stop loading on successful connection
          resolve(socket);
        };

        socket.onmessage = function (event) {
          const data = JSON.parse(event.data);
          if (data.type === 'sessionId') {
            // Store the sessionId sent from the server
            sessionId = data.sessionId;
            sessionStorage.setItem('sessionId', sessionId);
          } else {
            // Handle other messages
            console.log('Received message:', data);
          }
        };

        socket.onerror = function (error) {
          console.error('WebSocket connection error', error);
          // Not stopping loading here because we may retry
        };

        socket.onclose = function (event) {
          if (event.wasClean) {
            console.log(
              `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`
            );
          } else {
            console.error('WebSocket connection died');
          }
          // Do not dispatch stopLoading() here, because we may retry
          reject();
        };
      });
    };

    const attemptConnection = async () => {
      while (attempts < maxRetries) {
        try {
          await connectSocket();
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

// Define initial state
const initialState = {
  loading: 0,
  lang: localStorage.getItem("appLanguage") || "en",
  popup: {
    isDisplayed: false,
    type: "",
    title: "",
    message: "",
    multiMessages: [],
    headers: [],
    buttonLabel: "",
  },
  errorPopup: {
    isDisplayed: false,
    title: "",
    body: "",
  },
  confirmationPopup: {
    isDisplayed: false,
    actionName: "",
    actionMessage: "",
    confirmCallback: null,
    declineCallback: null,
    confirmationButtonText: "",
    cancelText: "",
    closable: false,
    confirmationButtonProps: {},
  },
  socket: null, // Initialize socket in state
  socketInitialized: false
};

const utilitiesSlice = createSlice({
  name: "utilities",
  initialState: initialState,
  reducers: {
    startLoading: (state) => {
      state.loading += 1;
    },
    stopLoading: (state) => {
      state.loading = Math.max(0, state.loading - 1);
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
      localStorage.setItem("appLanguage", newLang); // Persist language to localStorage
    },
    openSocket: (state, action) => {
      state.socket = action.payload;
      state.socketInitialized = true;
    },
    closeSocket: (state) => {
      if (state.socket) {
        state.socket.close();
        state.socket = null;
      }
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
  openSocket,
  closeSocket,
} = utilitiesSlice.actions;

export const selectLanguage = (state) => state.utilities.lang;

export default utilitiesSlice.reducer;
