import ReduxDispatchSingleton from './reduxDispatchSingleton';
import {startLoading, stopLoading} from '../redux/slices/utilitiesSlice.js';
import showMessage from './showMessagePopup';

export function handleHttpRequestPromise(
  request,
  errorMessageConfig,
  successMessageConfig
) {
  return new Promise((resolve, reject) => {
    handleHTTPRequest(() => request, {
      handleException: reject,
      handleSuccess: resolve,
      errorMessageConfig,
      successMessageConfig,
    });
  });
}

export async function handleHTTPRequest(
  executionCode,
  {handleException, handleSuccess, errorMessageConfig, successMessageConfig}
) {
  const dispatch = ReduxDispatchSingleton.getDispatch();
  dispatch(startLoading());
  return new Promise((resolve, reject) => {
    executionCode()
      .then((result) => {
        resolve(result);
      })
      .catch(reject);
  })
    .then((result) => {
      if (successMessageConfig) showMessage(successMessageConfig);
      handleSuccess(result);
    })
    .catch((error) => {
      var statuses = errorMessageConfig.showForStatuses.split(',');
      if (
        errorMessageConfig &&
        (statuses.includes('all') ||
          statuses.includes(error.response.status.toString()))
      )
        showMessage(errorMessageConfig);
      handleException(error);
    })
    .finally(() => {
      dispatch(stopLoading());
    });
}
