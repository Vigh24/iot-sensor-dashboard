import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    IconButton, 
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import { logout } from '../services/authService';
import ConnectionStatus from './ConnectionStatus';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ isConnected, darkMode, onThemeChange }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    return (
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', backdropFilter: 'blur(10px)' }}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    IoT Dashboard
                    <Typography component="span" variant="subtitle1" sx={{ ml: 1, opacity: 0.7 }}>
                        Real-time Monitoring
                    </Typography>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ConnectionStatus isConnected={isConnected} />
                    
                    <IconButton onClick={onThemeChange} color="inherit">
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <IconButton onClick={handleMenu} color="inherit">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>A</Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClose}>
                            <SettingsIcon sx={{ mr: 1 }} /> Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 