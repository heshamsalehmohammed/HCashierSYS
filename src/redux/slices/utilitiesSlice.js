import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleHttpRequestPromise } from '../../services/HTTPRequestHandler';
import { fetchSessionAPI } from '../../api/utilitiesAPI';


export const initializeSession = createAsyncThunk(
    "utilities/initializeSession",
    async (payload, thunkAPI) => {
      
      return handleHttpRequestPromise(fetchSessionAPI(), {
        type: "openPopup",
        showForStatuses: "400,401,500,404,501",
        payload: {
          type: "Error",
          title: "Error fetch Stats",
          message:
            "An unexpected error occurred, Cannot fetch Stats at thee moment. ",
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

// Define initial state
const initialState = {
    loading: 0,
    lang: localStorage.getItem('appLanguage') || 'en',
    tabSessionId: null,
    sessionStatus:'idle',
    popup: {
        isDisplayed: false,
        type: '',
        title: '',
        message: '',
        multiMessages: [],
        headers: [],
        buttonLabel: ''
    },
    errorPopup: {
        isDisplayed: false,
        title: '',
        body: ''
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
        confirmationButtonProps: {}
    },
};

const utilitiesSlice = createSlice({
    name: 'utilities',
    initialState: initialState,
    reducers: {
        startLoading: state => {
            state.loading += 1;
        },
        stopLoading: state => {
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
                buttonLabel: payload.buttonLabel
            };
        },
        closePopup: state => {
            state.popup.isDisplayed = false;
        },
        openErrorPopup: (state, action) => {
            const payload = action.payload;
            state.errorPopup = {
                isDisplayed: true,
                title: payload.title,
                body: payload.body
            };
        },
        closeErrorPopup: state => {
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
                confirmationButtonProps: payload.confirmationButtonProps
            };
        },
        closeConfirmationPopup: state => {
            state.confirmationPopup.isDisplayed = false;
        },
        changeLanguage: (state, action) => {
            const newLang = action.payload;
            state.lang = newLang;
            localStorage.setItem('appLanguage', newLang);  // Persist language to localStorage
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeSession.pending, (state) => {
                state.sessionStatus = 'loading';
            })
            .addCase(initializeSession.fulfilled, (state, action) => {
                state.tabSessionId = action.payload.tabSessionId;
                state.sessionStatus = 'succeeded';
            })
            .addCase(initializeSession.rejected, (state) => {
                state.sessionStatus = 'failed';
            })
    }
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
    changeLanguage
} = utilitiesSlice.actions;


export const selectLanguage = (state) => state.utilities.lang;

export default utilitiesSlice.reducer;
