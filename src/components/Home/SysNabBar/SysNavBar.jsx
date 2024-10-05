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
import { useState } from "react";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState(false);

  const changeLanguage = (isChecked) => {
    const lang = isChecked ? "ar" : "en";
    i18n.changeLanguage(lang);
  };

  const initializedStateOrdersCount = useSelector(selectInitializedOrdersCount);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
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
      className="p-menuitem-link "
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
