import React from "react";
import { Routes, Route } from "react-router-dom";
import SysNavBar from "./SysNabBar/SysNavBar";
import "./Home.scss";
import Customers from "./Customers/Customers";

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
          path="/customers"
          element={
            <BodyContentWrapper>
              <Customers />
            </BodyContentWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default Home;
