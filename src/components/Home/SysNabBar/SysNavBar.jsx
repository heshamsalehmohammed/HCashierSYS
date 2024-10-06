import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import "./SysNavBar.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { selectInitializedOrdersCount } from "../../../redux/slices/statisticsSlice";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "primereact/togglebutton";
import { unwrapResult } from "@reduxjs/toolkit";
import { changeLanguage, selectLanguage, showToast } from "../../../redux/slices/utilitiesSlice";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const initializedOrdersCount = useSelector(selectInitializedOrdersCount);
  const currentLanguage = useSelector(selectLanguage);  // Select language from Redux



  const handleLogout = () => {
    dispatch(logoutUser()).unwrap().then(() => {
      navigate("/login");
    }).catch((error) => {
      console.error("Logout error:", error);  // Log the error for debugging
    });
  };

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && (
        <Badge className="ml-auto p-tag p-tag-info" value={item.badge} />
      )}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );


  const handleLanguageChange = (isChecked) => {
    const newLang = isChecked ? 'ar' : 'en';
    dispatch(changeLanguage(newLang));  // Dispatch action to update language in Redux
  };

  const languageChangeRenderer = (item) => (
    <ToggleButton
      checked={currentLanguage === 'ar'}  // Render toggle button based on the language in Redux
      onChange={(e) => handleLanguageChange(e.value)}
      className="p-menuitem-link"
      onLabel={t('langAr')}
      offLabel={t('langEng')}
    />
  );


  const items = [
    {
      label: t("customers"),
      icon: "pi pi-user",
      command: (event) => {
        navigate("customers");
      },
    },
    {
      label: t("orders"),
      icon: "pi pi-objects-column",
      badge:
        initializedOrdersCount === 0
          ? undefined
          : initializedOrdersCount,
      template: itemRenderer,
      command: (event) => {
        navigate("orders");
      },
    },
    {
      label: t("stock"),
      icon: "pi pi-shop",
      command: (event) => {
        navigate("stock");
      },
    },
    {
      label: t("lang"),
      template: languageChangeRenderer,
    },
  ];

  const start = (
    <img
      alt="logo"
      src="/HCashierSYS.png"
      height="40"
      className="mr-2 cursor-pointer"
      onClick={() => navigate("/home")}
    ></img>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <p className="cursor-pointer" onClick={handleLogout}>
        {t("logout")}
      </p>
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default SysNavBar;