import React from "react";

import "./ErrorPopup.scss";
import { useDispatch } from "react-redux";
//import errorIcon from '../../../../../../assets/images/error-icon.png';
import { closeErrorPopup } from "../../../redux/slices/utilitiesSlice";
import { Dialog } from "primereact/dialog";

const ErrorPopup = (props) => {
  const { isErrorPopupShown, handleCloseErrorPopup, title, body } = props;

  const dispatch = useDispatch();

  console.log("ErrorPopup ");

  const handleClose =
    handleCloseErrorPopup ||
    (() => {
      dispatch(closeErrorPopup());
    });

  const headerTemplate = () => {
    return (
      <>
        <i
          className="fa fa-warning text-danger"
          style={{
            fontSize: "1.5em",
            marginRight: "8px",
          }}
        />
        <img
          //src={waringnIcon}
          style={{
            width: "15px",
            margin: "3px 10px 0 0",
            float: "left",
          }}
        />

        {title}
      </>
    );
  };

  return (
    <>
      <Dialog
        header={headerTemplate()}
        visible
        style={{ width: "35vw" }}
        modal
        onHide={handleClose}
      >
        <div className="dialog-content">
          <h6
            style={{
              marginTop: "8px",
              marginBottom: "8px",
            }}
          >
            {body}
          </h6>
        </div>
        <div className="dialog-footer">
          <button
            className="btn btn-primary float-right tms-dark-btn"
            style={{
              marginTop: "16px",
              // className: {type === 'Error'}? ' ' : ''
            }}
            onClick={handleClose}
          >
            Got It
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default ErrorPopup;
