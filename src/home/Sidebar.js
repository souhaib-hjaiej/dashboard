import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,  Typography, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';


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
                    Lumiere
                  </Typography>
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" onClick={() => handleClick('AdressBook')}>
              <ListItemIcon>
                <PeopleOutlinedIcon sx={{ color: selected === 'AdressBook' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="Carnet d'adresse" sx={{ color: selected === 'AdressBook' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/sim" onClick={() => handleClick('SIM')}>
              <ListItemIcon>
                <ContactsOutlinedIcon sx={{ color: selected === 'SIM' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="SIM" sx={{ color: selected === 'SIM' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/create-user" onClick={() => handleClick('Gestion Utilisateur')}>
              <ListItemIcon>
                <PersonOutlinedIcon sx={{ color: selected === 'Gestion Utilisateur' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="Gestion utilisateur" sx={{ color: selected === 'Gestion Utilisateur' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard" onClick={() => handleClick('Dashboard')}>
              <ListItemIcon>
                <PersonOutlinedIcon sx={{ color: selected === 'Dashboard' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ color: selected === 'Dashboard' ? '#6870fa' : (mode === 'dark' ? colors.dark.grey : colors.light.grey) }} />
            </ListItemButton>
          </ListItem>
          
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarComponent;