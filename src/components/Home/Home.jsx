import { Routes, Route } from "react-router-dom";
import SysNavBar from "./SysNabBar/SysNavBar";
import "./Home.scss";
import Customers from "./Customers/Customers";
import Stock from "./Stock/Stock";
import Order from "./Order/Order";
import Orders from "./Orders/Orders";

const BodyContentWrapper = ({ children }) => {
  return (
    <div className="body-content container p-3 mt-3 m-auto">{children}</div>
  );
};

const Home = () => {
  return (
    <div className="">
      <SysNavBar />

      <Routes>
        <Route
          path="/customers/*"
          element={
            <BodyContentWrapper>
              <Customers />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/stock/*"
          element={
            <BodyContentWrapper>
              <Stock />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/order"
          element={
            <BodyContentWrapper>
              <Order />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/orders/*"
          element={
            <BodyContentWrapper>
              <Orders />
            </BodyContentWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default Home;
