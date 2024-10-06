// webSocketManager.js

import { coreClean, logoutUser } from "../redux/slices/authSlice";
import { socketClosed } from "../redux/slices/utilitiesSlice";

let socket = null;

export const getWebSocket = () => socket;

export const initWebSocketConnection = ({ token, sessionId, dispatch, onMessage }) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.error('No token found. Cannot initialize WebSocket connection.');
      return reject('No token found');
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WEBSOCKET_HOST;
    const wsUrl = `${protocol}//${host}?token=${token}${
      sessionId ? `&sessionId=${sessionId}` : ''
    }`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened.');
      resolve(socket);
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === 'sessionId') {
        // Store the sessionId sent from the server
        sessionId = data.sessionId;
        sessionStorage.setItem('sessionId', sessionId);
      } else {
        // Handle other messages
        console.log('Received message:', data);
        if (onMessage) {
          onMessage(data);
        }
      }
    };

    socket.onerror = function (error) {
      console.error('WebSocket connection error', error);
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error('WebSocket connection died');
        coreClean(dispatch)
      }
      socket = null;
      if (dispatch) {
        dispatch(socketClosed());
      }
    };
  });
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
