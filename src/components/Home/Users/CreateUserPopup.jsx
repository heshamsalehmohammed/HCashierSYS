// CreateUserPopup.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  closeAddUserPopup,
  editUser,
  addUser,
  selectAddUserPopup,
  setAddUserPopupName,
  setAddUserPopupEmail,
  setAddUserPopupPassword,
  setAddUserPopupRole,
} from "../../../redux/slices/usersSlice";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";

const CreateUserPopup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Access the addUserPopup state
  const addUserPopup = useSelector(selectAddUserPopup);

  // Get the current user's role from the auth state
  const currentUserRole = useSelector((state) => state.auth.user.role);

  // Define role options based on the current user's role
  let roleOptions = [];

  if (currentUserRole === "admin") {
    roleOptions = [
      { label: t("user"), value: "user" },
      { label: t("admin"), value: "admin" },
    ];
  } else if (currentUserRole === "master") {
    roleOptions = [
      { label: t("user"), value: "user" },
      { label: t("admin"), value: "admin" },
      // If masters cannot create 'master' users, omit the following line
      // { label: t("master"), value: "master" },
    ];
  }

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        {addUserPopup._id ? t("edit") : t("addNew")} {t("user")}
      </span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label={addUserPopup._id ? t("edit") : t("create")}
        icon="pi pi-check"
        onClick={() => {
          if (addUserPopup._id) {
            dispatch(editUser());
          } else {
            dispatch(addUser());
          }
        }}
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
        dispatch(closeAddUserPopup());
      }}
    >
      <div className="card flex justify-content-center align-items-center mt-5 mb-5 flex-column">
        {/* Name Input */}
        <div className="field w-12 md:w-8 mb-4">
          <label htmlFor="username">{t("name")}</label>
          <InputText
            className="w-12"
            id="username"
            value={addUserPopup.name}
            onChange={(e) => dispatch(setAddUserPopupName(e.target.value))}
          />
        </div>

        {/* Email Input */}
        <div className="field w-12 md:w-8 mb-4">
          <label htmlFor="email">{t("email")}</label>
          <InputText
            className="w-12"
            id="email"
            value={addUserPopup.email}
            onChange={(e) => dispatch(setAddUserPopupEmail(e.target.value))}
          />
        </div>

        {/* Password Input */}
        
          <div className="field w-12 md:w-8 mb-4">
            <label htmlFor="password">{t("password")}</label>
            <InputText
              type="password"
              className="w-12"
              id="password"
              value={addUserPopup.password}
              onChange={(e) => dispatch(setAddUserPopupPassword(e.target.value))}
            />
          </div>
       

        {/* Role Dropdown */}
        <div className="field w-12 md:w-8 mb-4">
          <label htmlFor="role">{t("role")}</label>
          <Dropdown
            className="w-12"
            id="role"
            value={addUserPopup.role}
            options={roleOptions}
            onChange={(e) => dispatch(setAddUserPopupRole(e.value))}
            placeholder={t("selectRole")}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateUserPopup;
