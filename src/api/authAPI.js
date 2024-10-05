import http from "../services/apiServices";

export const loginAPI = async (user) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}auth/login`,
    user
  );
  return result;
};

export const registerAPI = async (user) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}auth/register`
  );
  return result;
};

export const logoutAPI = async () => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}auth/logout`
  );
  return result;
};
