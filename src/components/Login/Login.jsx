import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import "./Login.scss";
import { useNavigate } from "react-router";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginUser({ username, password })).then(() => {
      navigate("/home");
    });
  };

  return (
    <>
      <div className="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">
              Welcome Back
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Username
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              type="password"
              placeholder="Password"
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              label="Sign In"
              icon="pi pi-user"
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
