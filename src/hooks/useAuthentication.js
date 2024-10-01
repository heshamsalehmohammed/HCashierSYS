import React, {useState, useEffect} from 'react';

const useIsAuthenticated = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  return token != null;
};

export default useIsAuthenticated;
