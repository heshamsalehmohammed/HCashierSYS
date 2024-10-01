import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeAddUserPopupAddress,
  selectAddUserPopup,
  setAddUserPopupAddress,
  setAddUserPopupName,
  setAddUserPopupPhone,
} from "../../../redux/slices/usersSlice";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";


const CreateUserPopup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addUserPopup = useSelector(selectAddUserPopup);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Add New User</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label="Create"
        icon="pi pi-check"
        onClick={() => dispatch(closeAddUserPopupAddress())}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      visible={addUserPopup.isShown}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={() => {
        if (!addUserPopup.isShown) return;
        dispatch(closeAddUserPopupAddress());
      }}
    >
      <div className=" card flex justify-content-center align-items-center mt-5 mb-5 flex-column">
        <FloatLabel className="w-12 w-12 md:w-8 mb-4">
          <label htmlFor="username">Username</label>
          <InputText
            className="w-12"
            id="username"
            value={addUserPopup.name}
            onChange={(e) => dispatch(setAddUserPopupName(e.target.value))}
          />
        </FloatLabel>

        <FloatLabel className="  w-12 w-12 md:w-8 mb-4">
          <label htmlFor="phone">Phone</label>
          <InputText
            className="w-12"
            id="phone"
            value={addUserPopup.phone}
            onChange={(e) => dispatch(setAddUserPopupPhone(e.target.value))}
          />
        </FloatLabel>

        <FloatLabel className="w-12 md:w-8">
          <InputTextarea
            id="Address"
            className="w-12"
            value={addUserPopup.address}
            onChange={(e) => dispatch(setAddUserPopupAddress(e.target.value))}
            rows={5}
            cols={25}
          />
          <label htmlFor="Address">Address</label>
        </FloatLabel>
      </div>
    </Dialog>
  );
};

export default CreateUserPopup;
