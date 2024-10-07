// api/masterUserApi.js

import http from '../services/apiServices';

// Fetch users and sessions
export const fetchUsersSessionsAPI = async (criteria) => {
  const result = await http.get(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/users-sessions`, { params: criteria });
  return result;
};

// Send message to a session
export const sendMessageToSessionAPI = async ({ sessionId, message }) => {
  const result = await http.post(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/session/${sessionId}/message`, { message });
  return result;
};

export const sendBroadCastAPI = async ({ sessionId, message }) => {
  const result = await http.post(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/broadcast`, { message });
  return result;
};
// Send message to all user's sessions
export const sendMessageToUserSessionsAPI = async ({ userId, message }) => {
  const result = await http.post(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/user/${userId}/message`, { message });
  return result;
};

// Terminate a session
export const terminateSessionAPI = async (sessionId) => {
  const result = await http.delete(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/session/${sessionId}`);
  return result;
};

// Terminate all user's sessions
export const terminateUserSessionsAPI = async (userId) => {
  const result = await http.delete(`${process.env.REACT_APP_API_ENDPOINT_PREFIX}masteruser/user/${userId}/sessions`);
  return result;
};
