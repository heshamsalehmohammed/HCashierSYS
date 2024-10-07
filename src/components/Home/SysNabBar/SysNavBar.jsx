// SysNavBar.js

import React, { useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import "./SysNavBar.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { selectInitializedOrdersCount } from "../../../redux/slices/statisticsSlice";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "primereact/togglebutton";
import { changeLanguage, selectLanguage } from "../../../redux/slices/utilitiesSlice";
import { UserRoleNameEnum } from "../../utilities/PermissionGate/enum";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initializedOrdersCount = useSelector(selectInitializedOrdersCount);
  const currentLanguage = useSelector(selectLanguage); // Select language from Redux
  const currentUserRole = useSelector((state) => state.auth.user.role);

  const handleLogout = () => {
    dispatch(logoutUser());
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
    const newLang = isChecked ? "ar" : "en";
    dispatch(changeLanguage(newLang)); // Dispatch action to update language in Redux
  };

  const languageChangeRenderer = (item) => (
    <ToggleButton
      checked={currentLanguage === "ar"} // Render toggle button based on the language in Redux
      onChange={(e) => handleLanguageChange(e.value)}
      className="p-menuitem-link"
      onLabel={t("langAr")}
      offLabel={t("langEng")}
    />
  );

  const items = [
    {
      label: t("customers"),
      icon: "pi pi-user",
      command: () => navigate("customers"),
    },
    {
      label: t("orders"),
      icon: "pi pi-objects-column",
      badge: initializedOrdersCount === 0 ? undefined : initializedOrdersCount,
      template: itemRenderer,
      command: () => navigate("orders"),
    },
    {
      label: t("stock"),
      icon: "pi pi-shop",
      command: () => navigate("stock"),
    },
    {
      label: t("lang"),
      template: languageChangeRenderer,
    },
  ];

  if (currentUserRole === UserRoleNameEnum.MASTER) {
    items.splice(3, 0, {
      label: "Master",
      icon: "pi pi-spin pi-cog",
      command: () => navigate("master"),
    });
  }

  if (currentUserRole === UserRoleNameEnum.MASTER || currentUserRole === UserRoleNameEnum.ADMIN) {
    items.splice(3, 0, {
      label: t("Users"),
      icon: "pi pi-user",
      command: () => navigate("users"),
    });
  }

  const start = (
    <img
      alt="logo"
      src="/HCashierSYS.png"
      height="40"
      className="mr-2 cursor-pointer"
      onClick={() => navigate("/home")}
    />
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <p className="cursor-pointer" onClick={handleLogout}>
        {t("logout")}
      </p>
    </div>
  );

  // Sticky Navbar effect
  useEffect(() => {
    const navbar = document.querySelector(".sys-navbar");
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0;

    const handleScroll = () => {
      if (window.scrollY > headerHeight) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sys-navbar">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
};

export default SysNavBar;
