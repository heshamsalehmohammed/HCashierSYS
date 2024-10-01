import React from "react";
import { Routes, Route } from "react-router-dom";
import SysNavBar from "./SysNabBar/SysNavBar";
import "./Home.scss";
import Users from "./Users/Users";

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
          path="/users"
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
