import "./App.scss"; // Import SCSS file
import "./PrimeFlexDirectionEnhancement.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import NotFound from "./components/Notfound";
import { useDispatch, useSelector } from "react-redux";
import ReduxDispatchSingleton from "./services/reduxDispatchSingleton";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/utilities/PrivateRoute";
import "./i18n"; // Import i18n configuration
import { selectLanguage } from "./redux/slices/utilitiesSlice";
import PrimeReact from "primereact/api";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage); // Select language from Redux
  const { t, i18n } = useTranslation();
  ReduxDispatchSingleton.setDispatch(dispatch);

  // Update PrimeReact RTL and direction based on the language
  const updateDirection = (language) => {
    const isRTL = language === "ar";
    PrimeReact.rtl = isRTL;
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.body.style.direction = isRTL ? "rtl" : "ltr";
  };

  // When the language in the Redux store changes, update i18n and page direction
  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    updateDirection(currentLanguage);
  }, [currentLanguage, i18n]);
  return (
    <Router>
      <MainLayout>
        <div className="App" id="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route
              path="/home/*"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </MainLayout>
    </Router>
  );
}

export default App;
