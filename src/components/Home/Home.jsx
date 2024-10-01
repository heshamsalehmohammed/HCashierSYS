import React from "react";
import { Routes, Route } from "react-router-dom";
import SysNavBar from "./SysNabBar/SysNavBar";
import UserNavBar from "./UserNavBar/UserNavBar";
import "./Home.scss";

const BodyContentWrapper = ({ children }) => {
  return (
    <div className="body-content container p-3 mt-3 m-auto">{children}</div>
  );
};

const Home = () => {
  return (
    <div>
      <UserNavBar />
      <SysNavBar />

      <Routes>
{/*         <Route
          path="/vacations"
          element={
            <BodyContentWrapper>
              <Vacations />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/vacations/*"
          element={
            <BodyContentWrapper>
              <Vacations />
            </BodyContentWrapper>
          }
        />
        <Route
          path="/timesheet"
          element={
            <BodyContentWrapper>
              <Timesheet />
            </BodyContentWrapper>
          }
        /> */}
      </Routes>
    </div>
  );
};

export default Home;
