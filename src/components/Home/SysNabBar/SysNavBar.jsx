import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./SysNavBar.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { selectInitializedStateOrdersCount } from "../../../redux/slices/ordersSlice";

const SysNavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializedStateOrdersCount = useSelector(selectInitializedStateOrdersCount)
/*   const user = useSelector((state) => state.auth.user);
 */
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto p-tag p-tag-info" value={item.badge} />}
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
      badge: initializedStateOrdersCount=== 0 ? undefined : initializedStateOrdersCount,
      template: itemRenderer,
      command: (event) => {
        navigate("orders");
      },
    },
    {
      label: "Stock",
      icon: "pi pi-shop",
      command: (event) => {
        navigate("stock");
      },
    },
  ];

  const start = (
    <img alt="logo" src="/HCashierSYS.png" height="40" className="mr-2 cursor-pointer" onClick={()=> navigate("/home")}></img>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      {/* <Avatar image="/profile.png" /> */}
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
