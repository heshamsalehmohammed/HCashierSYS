import { Routes, Route } from "react-router-dom";
import SysNavBar from "./SysNabBar/SysNavBar";
import "./Home.scss";
import Customers from "./Customers/Customers";
import Stock from "./Stock/Stock";
import Order from "./Order/Order";
import Orders from "./Orders/Orders";
import Stat from "./Stat/Stat";
import { useDispatch, useSelector } from "react-redux";
import { initWebSocket } from "../../redux/slices/utilitiesSlice";
import { useEffect } from "react";
import MasterManagement from "./Master/MasterManagement";
import Users from "./Users/Users";

const BodyContentWrapper = ({ children }) => {
  return (
    <div className="surface-ground body-content container p-3 mt-3 m-auto">{children}</div>
  );
};

const Home = () => {

const dispatch = useDispatch();
  // Get authentication state and socket from Redux
  const user = useSelector((state) => state.auth.user);
  const socketInitialized = useSelector((state) => state.utilities.socketInitialized);

  useEffect(() => {
    if (user && !socketInitialized) {
      dispatch(initWebSocket({ maxRetries: 1, retryDelay: 2000 }));
    }
  }, [dispatch, user, socketInitialized]);

  if (!socketInitialized) {
    // Show a loading indicator until the WebSocket is initialized
    return null;
  }




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
        <Route
          path="/"
          element={
            <BodyContentWrapper>
              <Stat />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/master/*"
          element={
            <BodyContentWrapper>
              <MasterManagement />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/users/*"
          element={
            <BodyContentWrapper>
              <Users />
            </BodyContentWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default Home;
