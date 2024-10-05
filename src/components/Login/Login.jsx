import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import "./Login.scss";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next"; // Import the hook
import { Message } from "primereact/message";
import { unwrapResult } from "@reduxjs/toolkit";

const Login = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginUser({ emailOrName: username, password })).then(unwrapResult).then(() => {
      navigate("/home");
    }).catch((error) => {
      console.error("Logout error:", error);  // Log the error for debugging
    });
  };

  return (
    <>
      <div className="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">
              {t("welcomeBack")}
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              {t("usernameLabel")}
            </label>
            <InputText
              id="email"
              type="text"
              placeholder={t("emailPlaceholder")}
              className="w-full mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              {t("passwordLabel")}
            </label>
            <InputText
              type="password"
              placeholder={t("passwordLabel")}
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Message
                severity="error"
                className="mb-2 w-full"
                text={error}
              />
            )}

            <Button
              label={t("signInButton")}
              icon="pi pi-user"
              className="w-full "
              onClick={handleLogin}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
