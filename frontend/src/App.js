import React, { useState, useEffect } from 'react';
import { 
    Box, 
    CssBaseline, 
    Typography, 
    IconButton, 
    Badge,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';
import { isAuthenticated } from './services/authService';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import NotificationMenu from './components/NotificationMenu';
import SettingsPanel from './components/SettingsPanel';
import { notificationService, NOTIFICATION_TYPES, createNotification } from './services/notificationService';
import { exportData } from './utils/exportData';
import { themePresets, getThemeOptions } from './theme/themePresets';
import './styles.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [currentTheme, setCurrentTheme] = useState(() => {
        const savedTheme = localStorage.getItem('themePreset');
        if (savedTheme && themePresets[savedTheme]) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [isConnected, setIsConnected] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [exportInProgress, setExportInProgress] = useState(false);
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('dashboardSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            notifications: true,
            soundEnabled: true,
            dataRefreshInterval: 5,
            chartUpdateInterval: 1,
            temperatureUnit: 'celsius'
        };
    });

    // Create theme based on current preset
    const theme = createTheme(getThemeOptions(currentTheme));

    // Subscribe to notifications
    useEffect(() => {
        const unsubscribe = notificationService.subscribe(setNotifications);
        return () => unsubscribe();
    }, []);

    // Monitor connection status
    useEffect(() => {
        const handleConnectionChange = (connected) => {
            setIsConnected(connected);
            notificationService.notify(createNotification(
                NOTIFICATION_TYPES.CONNECTION_STATUS,
                connected ? 'Connection restored' : 'Connection lost',
                connected ? 'normal' : 'high'
            ));
        };

        window.addEventListener('online', () => handleConnectionChange(true));
        window.addEventListener('offline', () => handleConnectionChange(false));

        return () => {
            window.removeEventListener('online', () => handleConnectionChange(true));
            window.removeEventListener('offline', () => handleConnectionChange(false));
        };
    }, []);

    // Add this effect after the other useEffect declarations
    useEffect(() => {
        // Sync sound settings with notification service
        notificationService.setSoundEnabled(settings.soundEnabled);
    }, [settings.soundEnabled]);

    const handleThemeChange = (newTheme) => {
        setCurrentTheme(newTheme);
        localStorage.setItem('themePreset', newTheme);
        notificationService.notify(createNotification(
            NOTIFICATION_TYPES.SYSTEM_STATUS,
            `Theme changed to ${themePresets[newTheme].name}`,
            'normal'
        ));
    };

    const handleExportData = async () => {
        setExportInProgress(true);
        try {
            // Get the current sensor data from the Dashboard component
            // This should be passed as a prop or managed in a state management solution
            const data = [
                {
                    timestamp: new Date(),
                    value: 25.5,
                    type: 'temperature',
                    unit: '°C'
                },
                // Add more sample data or get real data from your state management
            ];
            
            await exportData(data, 'csv');
            
            // Use a silent notification for export success
            notificationService.notify({
                type: NOTIFICATION_TYPES.DATA_EXPORT,
                message: 'Data exported successfully',
                priority: 'normal',
                silent: true // Add this flag to prevent sound
            });
        } catch (error) {
            console.error('Export failed:', error);
            
            // Use a silent notification for export failure
            notificationService.notify({
                type: NOTIFICATION_TYPES.DATA_EXPORT,
                message: 'Failed to export data',
                priority: 'high',
                silent: true // Add this flag to prevent sound
            });
        }
        setExportInProgress(false);
    };

    const handleSettingsOpen = () => setSettingsOpen(true);
    const handleSettingsClose = () => setSettingsOpen(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        notificationService.notify(createNotification(
            NOTIFICATION_TYPES.SYSTEM_STATUS,
            'Welcome back! You have successfully logged in.',
            'normal'
        ));
    };

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);
    const handleNotificationMenuOpen = (event) => setNotificationAnchorEl(event.currentTarget);
    const handleNotificationMenuClose = () => setNotificationAnchorEl(null);

    const handleLogout = () => {
        setIsLoggedIn(false);
        handleProfileMenuClose();
        notificationService.notify(createNotification(
            NOTIFICATION_TYPES.SYSTEM_STATUS,
            'You have been logged out',
            'normal'
        ));
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
            return newSettings;
        });

        // Notify about settings change
        notificationService.notify({
            type: NOTIFICATION_TYPES.SYSTEM_STATUS,
            message: `Setting "${key}" updated`,
            priority: 'normal',
            silent: true // Don't play sound for settings changes
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                transition: theme.transitions.create(['background-color', 'color'], {
                    duration: theme.transitions.duration.standard,
                })
            }}>
                {!isLoggedIn ? (
                    <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            bgcolor: 'background.paper',
                            borderBottom: 1,
                            borderColor: 'divider',
                            transition: theme.transitions.create(['background-color', 'border-color'], {
                                duration: theme.transitions.duration.standard,
                            })
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                    variant="h5" 
                                    component="h1" 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <span role="img" aria-label="dashboard">📊</span>
                                    IoT Sensor Dashboard
                                </Typography>
                                <Tooltip title={isConnected ? "Connected" : "Connection Lost"}>
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                        {isConnected ? (
                                            <SignalWifiStatusbar4BarIcon color="success" />
                                        ) : (
                                            <SignalWifiStatusbarConnectedNoInternet4Icon color="error" />
                                        )}
                                    </Box>
                                </Tooltip>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    onClick={handleExportData}
                                    disabled={exportInProgress}
                                >
                                    {exportInProgress ? 'Exporting...' : 'Export Data'}
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    size="small"
                                    onClick={handleSettingsOpen}
                                >
                                    Settings
                                </Button>
                                
                                <Tooltip title="Notifications">
                                    <IconButton onClick={handleNotificationMenuOpen}>
                                        <Badge 
                                            badgeContent={notifications.filter(n => !n.read).length} 
                                            color="error"
                                        >
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                
                                <ThemeToggle 
                                    currentTheme={currentTheme}
                                    onThemeChange={handleThemeChange}
                                />
                                
                                <Tooltip title="Account">
                                    <IconButton onClick={handleProfileMenuOpen}>
                                        <AccountCircleIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleProfileMenuClose}>My Account</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>

                        <NotificationMenu
                            anchorEl={notificationAnchorEl}
                            open={Boolean(notificationAnchorEl)}
                            onClose={handleNotificationMenuClose}
                            notifications={notifications}
                            onMarkAsRead={(id) => {
                                notificationService.markAsRead(id);
                                handleNotificationMenuClose();
                            }}
                            onMarkAllAsRead={() => notificationService.markAllAsRead()}
                            onClearAll={() => notificationService.clearAll()}
                        />

                        <Dialog
                            open={settingsOpen}
                            onClose={handleSettingsClose}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>Settings</DialogTitle>
                            <DialogContent>
                                <SettingsPanel 
                                    settings={settings}
                                    onSettingChange={handleSettingChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleSettingsClose}>Close</Button>
                            </DialogActions>
                        </Dialog>

                        <Dashboard 
                            darkMode={theme.palette.mode === 'dark'}
                            onConnectionChange={setIsConnected}
                        />
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;
