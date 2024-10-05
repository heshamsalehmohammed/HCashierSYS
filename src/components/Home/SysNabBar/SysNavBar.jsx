import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./SysNavBar.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { selectInitializedOrdersCount } from "../../../redux/slices/statisticsSlice";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "primereact/togglebutton";
import { useEffect, useState } from "react";
import PrimeReact from "primereact/api";
import { unwrapResult } from "@reduxjs/toolkit";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const initializedStateOrdersCount = useSelector(selectInitializedOrdersCount);

  const [checked, setChecked] = useState(false);

  // Function to change language and store the preference in localStorage
  const changeLanguage = (isChecked) => {
    const lang = isChecked ? "ar" : "en";
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
    localStorage.setItem("languageChecked", isChecked ? "true" : "false");
    updateDirection(lang);  // Apply direction change on language change
  };

  // Function to update the page direction based on language
  const updateDirection = (language) => {
    const isRTL = language === "ar";
    const direction = isRTL ? "rtl" : "ltr";

    PrimeReact.rtl = isRTL; // Enable or disable RTL in PrimeReact

    // Set the direction on document and body
    document.documentElement.setAttribute("dir", direction);
    document.body.style.direction = direction; 
  };

  // Initialize the language and direction based on localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage") || "en";
    const savedChecked = localStorage.getItem("languageChecked") === "true";
    
    i18n.changeLanguage(savedLanguage);  // Set language
    setChecked(savedChecked);  // Sync the toggle state
    updateDirection(savedLanguage);  // Set the direction on load
  }, [i18n]);

  useEffect(() => {
    // Update the page direction whenever the language changes
    updateDirection(i18n.language);
  }, [i18n.language]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(unwrapResult).then(() => {
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

  const languageChangeRenderer = (item) => (
    <ToggleButton
      checked={checked}
      onChange={(e) => {
        setChecked(e.value);
        changeLanguage(e.value);
      }}
      className="p-menuitem-link"
      onLabel={t("langAr")}
      offLabel={t("langEng")}
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
        initializedStateOrdersCount === 0
          ? undefined
          : initializedStateOrdersCount,
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