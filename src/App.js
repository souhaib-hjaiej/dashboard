import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import {ColorModeContext, useMode} from "./theme";
import { CssBaseline } from "@mui/material";
import Topbar from "./home/Topbar";
import Sidebar from "./home/Sidebar";
import AdressBook from "./userhome/AdressBook";
import Sim from "./userhome/Sim";
import CreateUser from "./userhome/CreateUser";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <Sidebar isSidebar={isSidebar}  />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<AdressBook />} />
              <Route path="/sim" element={<Sim />} />
              <Route path="/create-user" element={<CreateUser />} />
            
              
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;
