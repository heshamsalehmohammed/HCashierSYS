import { useLocation } from 'react-router-dom';


const useCurrentPathToFirstRouteNumber = (numberOfRoutesFromFirst = 1) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (numberOfRoutesFromFirst <= 0 || numberOfRoutesFromFirst > pathParts.length) {
    return "";
  }

  const slicedPathParts = pathParts.slice(0, numberOfRoutesFromFirst);
  const newPath = `/${slicedPathParts.join("/")}`;

  return newPath;
};


const useCurrentPathToLastRouteNumber = (numberOfRouteFromLast = 1) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (numberOfRouteFromLast <= 0 || numberOfRouteFromLast > pathParts.length) {
    return "";
  }

  const slicedPathParts = pathParts.slice(0, pathParts.length - numberOfRouteFromLast + 1);
  const newPath = `/${slicedPathParts.join("/")}`;

  return newPath;
};


const getLastPartOfPath=(path,numberOfTargetFromLast = 1)=>{
  const pathParts = path.split("/").filter(Boolean);
  const lastRoute = pathParts[pathParts.length - numberOfTargetFromLast] || "";
  return lastRoute;
}

const useLastRoute = (numberOfTargetFromLast = 1) => {
  const location = useLocation();
  return getLastPartOfPath(location.pathname,numberOfTargetFromLast);
};

const useFirstRoute = (numberOfTargetFromFirst = 1) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const firstRoute = pathParts[numberOfTargetFromFirst - 1] || "";

  return firstRoute;
};

// Hook to check if the last segment of the pathname matches any of the target routes
const useMatchedTargetRoutes = (matchedTargetRoutes = []) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const lastRoute = pathParts[pathParts.length - 1] || "";

  return matchedTargetRoutes.includes(lastRoute);
};

// Hook to check if the pathname starts with any of the specified paths
const useMatchedPathsFromBeginning = (matchedPathsFromBeginning = []) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  let currentPath = "/";
  for (let part of pathParts) {
    currentPath += part + "/";
    if (matchedPathsFromBeginning.some(path => currentPath.startsWith(path))) {
      return true;
    }
  }
  return false;
};

export { useMatchedTargetRoutes, useMatchedPathsFromBeginning ,useLastRoute,useFirstRoute,useCurrentPathToLastRouteNumber,useCurrentPathToFirstRouteNumber,getLastPartOfPath };