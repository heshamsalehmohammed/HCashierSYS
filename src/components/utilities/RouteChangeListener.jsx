import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setRoute } from "../../redux/slices/routeSlice";


// we are using this because we are using MemoryRoute so any other solutions like using middleware 
// or connecting the routing to the store wont work unless we use normal BrowserRoute 

const RouteChangeListener = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setRoute(location.pathname));
  }, [location, dispatch]);

  return null;
};

export default RouteChangeListener;
