import React from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./SysNavBar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items = [
    {
      label: "Customers",
      icon: "pi pi-user",
      command: (event) => {
        navigate("customers");
      },
    },
    {
      label: "Orders",
      icon: "pi pi-objects-column",
      badge: 3,
      template: itemRenderer,
    },
    {
      label: "Shop",
      icon: "pi pi-shop",
    },
  ];

  const start = (
    <img alt="logo" src="/HCashierSYS.png" height="40" className="mr-2"></img>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar image="/profile.png" />
      <p className="cursor-pointer" onClick={handleLogout}>
        Logout
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
