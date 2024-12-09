import React, { useState } from 'react';
import { 
    IconButton, 
    Tooltip, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText,
    Box,
    Fade
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import { themePresets } from '../theme/themePresets';

const ThemeToggle = ({ currentTheme, onThemeChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeSelect = (presetKey) => {
        onThemeChange(presetKey);
        handleClose();
    };

    const isDark = themePresets[currentTheme]?.palette.mode === 'dark';

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Theme Options">
                <IconButton 
                    onClick={handleClick}
                    color="inherit"
                    sx={{ 
                        ml: 1,
                        bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '&:hover': {
                            bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    <PaletteIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 180,
                        '& .MuiMenuItem-root': {
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.25,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            }
                        }
                    }
                }}
            >
                {Object.entries(themePresets).map(([key, theme]) => (
                    <MenuItem 
                        key={key} 
                        onClick={() => handleThemeSelect(key)}
                        selected={currentTheme === key}
                    >
                        <ListItemIcon>
                            {theme.palette.mode === 'dark' ? 
                                <Brightness4Icon fontSize="small" /> : 
                                <Brightness7Icon fontSize="small" />
                            }
                        </ListItemIcon>
                        <ListItemText primary={theme.name} />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default ThemeToggle; 