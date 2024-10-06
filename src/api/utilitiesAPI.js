import http from "../services/apiServices";

export const fetchSessionAPI = async () => {
  const result = await http.get(
    `${process.env.REACT_APP_PREFIX}create-session`,
     {
      withCredentials: true, // Include cookies in the request
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token if needed
      },
    }
  );
  return result;
};
