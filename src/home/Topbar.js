import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onLogout }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof onLogout === "function") { // Check if onLogout is a function
      onLogout(); // Call the logout function
      navigate("/login"); // Redirect to login page
    } else {
      console.error("onLogout is not a function");
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Box display="flex">
        <Tooltip title="Toggle Light/Dark Mode">
          <IconButton onClick={colorMode.toggleColorMode} aria-label="toggle light/dark mode">
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton aria-label="logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Topbar;
