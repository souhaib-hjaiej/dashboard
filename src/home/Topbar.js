import { Box, IconButton, useTheme, Tooltip, Typography } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: colors.background,
        zIndex: 1200, // Ensures the top bar is above other content
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Optional shadow for better visibility
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="h6" color={theme.palette.text.primary}>
          Lumiere
        </Typography>
      </Box>
      
      <Box display="flex" alignItems="center" gap={2}>
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
          <IconButton aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Topbar;
