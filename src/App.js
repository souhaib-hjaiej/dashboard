import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline } from "@mui/material";
import Topbar from "./home/Topbar";
import Sidebar from "./home/Sidebar";
import AdressBook from "./userhome/AdressBook";
import Sim from "./userhome/Sim";
import Users from "./userhome/users";
import Login from "./userhome/login";
import Dashboard from "./userhome/dashbord";
function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [user, setUser] = useState(null);
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && (
            <>
               <Sidebar isSidebar={isSidebar}  /> 
               <main className="content">
          <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/adressbook" />}
              />
              <Route
                path="/adressbook"
                element={isAuthenticated ? <AdressBook /> : <Navigate to="/login" />}
              />
              <Route
                path="/sim"
                element={isAuthenticated ? <Sim /> : <Navigate to="/login" />}
              />
              <Route
                path="/create-user"
                element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
              />
               <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/adressbook" : "/login"} />}
              />
            </Routes>
          </main>
            </>
          )}
         
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
