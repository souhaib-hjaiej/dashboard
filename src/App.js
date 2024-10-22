import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashbord";
import Calendar from "./pages/calender";
import CollaboratorDetails from "./pages/details";
import ChangePasswordForm from './pages/modifier';
import Forgetpassword from './pages/forgetpassword';


function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && (
            <>
              <Sidebar isSidebar={isSidebar} />
             
            </>
          )}
          <main className="content">
          <Topbar setIsSidebar={setIsSidebar} onLogout={handleLogout} />
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
             
              <Route
                path="/home"
                element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/calender"
                element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />}
              />

              <Route
                path="details"
                element={isAuthenticated ? <CollaboratorDetails /> : <Navigate to="/login" />}
              />
              <Route
                path="password"
                element={isAuthenticated ? <ChangePasswordForm /> : <Navigate to="/login" />}
              />
           <Route path="forgetpassword" element={<Forgetpassword />} />

              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
