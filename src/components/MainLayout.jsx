import React from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import Spinner from "./utilities/Spinner/Spinner";
import PopupMessage from "./utilities/PopupMessage/PopupMessage";
import ConfirmationPopupMessage from "./utilities/ConfirmationPopupMessage/ConfirmationPopupMessage";
import ErrorPopup from "./utilities/ErrorPopup/ErrorPopup";
import { useNavigate } from "react-router";
import RouterNavigationSingleton from "../services/routerNavigationSingleton";
import { useAppendToContainer } from "../hooks/useAppendToContainer";

const MainLayout = (props) => {
  const { children } = props;

  const loading = useSelector((state) => state.utilities.loading);

  const popup = useSelector((state) => state.utilities.popup);

  const confirmationPopup = useSelector(
    (state) => state.utilities.confirmationPopup
  );

  const errorPopup = useSelector((state) => state.utilities.errorPopup);

  const navigate = useNavigate();
  RouterNavigationSingleton.setNavigation(navigate);

  const container = useAppendToContainer();

  return (
    <>
      {loading ? ReactDOM.createPortal(<Spinner />, container) : <></>}

      {popup.isDisplayed ? (
        ReactDOM.createPortal(
          <PopupMessage
            title={popup.title}
            message={popup.message}
            type={popup.type}
            multiMessages={popup.multiMessages}
            headers={popup.headers}
            buttonLabel={popup.buttonLabel}
          />,
          container
        )
      ) : (
        <></>
      )}

      {confirmationPopup?.isDisplayed ? (
        ReactDOM.createPortal(
          <ConfirmationPopupMessage
            actionMessage={confirmationPopup.actionMessage || ""}
            actionName={confirmationPopup.actionName || ""}
            confirmCallback={confirmationPopup.confirmCallback || Function}
            cancelCallback={confirmationPopup.declineCallback}
            confirmationButtonText={confirmationPopup.confirmationButtonText}
            cancelText={confirmationPopup.cancelText}
            closable={confirmationPopup.closable}
            confirmationButtonProps={confirmationPopup.confirmationButtonProps}
          />,
          container
        )
      ) : (
        <></>
      )}

      {errorPopup?.isDisplayed ? (
        ReactDOM.createPortal(
          <ErrorPopup
            isErrorPopupShown={errorPopup?.isDisplayed}
            title={errorPopup.title}
            body={errorPopup.body}
          />,
          container
        )
      ) : (
        <></>
      )}

      {children}
    </>
  );
};

export default MainLayout;
