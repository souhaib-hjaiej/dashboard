import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,  Typography, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventIcon from '@mui/icons-material/Event';


const SidebarComponent = () => {
  const theme = useTheme();
  const mode = theme.palette.mode; // Get the current theme mode
  const colors = {
    dark: {
      primary: '#1F2A40',
      grey: '#FFFFFF',
    },
    light: {
      primary: '#FFFFFF', // Change this color for light mode
      grey: '#000000', // Change this color for light mode text
    },
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('AdressBook');

  const handleClick = (title) => {
    setSelected(title);
    setIsCollapsed(false); // Collapse the sidebar when an item is clicked
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 250,
          backgroundColor: mode === 'dark' ? colors.dark.primary : colors.light.primary,
          color: mode === 'dark' ? colors.dark.grey : colors.light.grey,
        },
      }}
    >
      <Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setIsCollapsed(!isCollapsed)}>
              <ListItemIcon>
                <MenuOutlinedIcon sx={{ color: mode === 'dark' ? colors.dark.grey : colors.light.grey }} />
              </ListItemIcon>
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <Typography variant="h3" color={mode === 'dark' ? colors.dark.grey : colors.light.grey}>
                    SoSmaison
                  </Typography>
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        </List>
        <List>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/Dashboard" onClick={() => handleClick('Dashboard')}>
              <ListItemIcon>
              <DashboardOutlinedIcon sx={{ color: selected === 'Dashboard' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ color: selected === 'Dashboard' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>

        

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/home" onClick={() => handleClick('home')}>
              <ListItemIcon>
                <ContactsOutlinedIcon sx={{ color: selected === 'home' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="home" sx={{ color: selected === 'home' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
  <ListItemButton component={Link} to="/calender" onClick={() => handleClick('calender')}>
    <ListItemIcon>
      <EventIcon sx={{ color: selected === 'calender' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
    </ListItemIcon>
    <ListItemText primary="calender" sx={{ color: selected === 'calender' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
  </ListItemButton>





</ListItem>

<ListItem disablePadding>
  <ListItemButton component={Link} to="/password" onClick={() => handleClick('password')}>
    <ListItemIcon>
      <EventIcon sx={{ color: selected === 'password' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
    </ListItemIcon>
    <ListItemText primary="password" sx={{ color: selected === 'password' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
  </ListItemButton>
</ListItem>

          


          
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarComponent;