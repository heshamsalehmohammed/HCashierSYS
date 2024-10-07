import http from "../services/apiServices";

export const fetchUsersAPI = async () => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}users`
  );
  return result;
};

export const fetchUserAPI = async (id) => {
  const result = await http.get(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}users/${id}`
  );
  return result;
};

export const addUserAPI = async (user) => {
  const result = await http.post(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}users`,
    user
  );
  return result;
};

export const editUserAPI = async (id, user) => {
  const result = await http.put(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}users/${id}`,
    user
  );
  return result;
};

export const deleteUserAPI = async (id) => {
  const result = await http.delete(
    `${process.env.REACT_APP_API_ENDPOINT_PREFIX}users/${id}`
  );
  return result;
};
