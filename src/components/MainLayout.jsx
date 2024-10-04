import React from 'react';
import {useSelector} from 'react-redux';
import Spinner from './utilities/Spinner/Spinner';
import PopupMessage from './utilities/PopupMessage/PopupMessage';
import ConfirmationPopupMessage from './utilities/ConfirmationPopupMessage/ConfirmationPopupMessage';
import ErrorPopup from './utilities/ErrorPopup/ErrorPopup';
import { useNavigate } from 'react-router';
import RouterNavigationSingleton from '../services/routerNavigationSingleton';


const MainLayout = (props) => {
  const {children} = props;

  const loading = useSelector((state) => state.utilities.loading);

  const popup = useSelector((state) => state.utilities.popup);

  const confirmationPopup = useSelector(
    (state) => state.utilities.confirmationPopup
  );

  const errorPopup = useSelector((state) => state.utilities.errorPopup);


  const navigate = useNavigate();
  RouterNavigationSingleton.setNavigation(navigate);

  return (
    <>
      {loading ? <Spinner /> : <></>}

      {popup.isDisplayed ? (
        <PopupMessage
          title={popup.title}
          message={popup.message}
          type={popup.type}
          multiMessages={popup.multiMessages}
          headers={popup.headers}
          buttonLabel={popup.buttonLabel}
        />
      ) : (
        <></>
      )}

      {confirmationPopup?.isDisplayed ? (
        <ConfirmationPopupMessage
          actionMessage={confirmationPopup.actionMessage || ''}
          actionName={confirmationPopup.actionName || ''}
          confirmCallback={confirmationPopup.confirmCallback || Function}
          cancelCallback={confirmationPopup.declineCallback}
          confirmationButtonText={confirmationPopup.confirmationButtonText}
          cancelText={confirmationPopup.cancelText}
          closable={confirmationPopup.closable}
          confirmationButtonProps={confirmationPopup.confirmationButtonProps}
        />
      ) : (
        <></>
      )}

      {errorPopup?.isDisplayed ? (
        <ErrorPopup
          isErrorPopupShown={errorPopup?.isDisplayed}
          title={errorPopup.title}
          body={errorPopup.body}
        />
      ) : (
        <></>
      )}

      {children}
    </>
  );
};

export default MainLayout;
