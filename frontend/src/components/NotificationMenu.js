import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    IconButton,
    Divider,
    useTheme
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const NotificationMenu = ({ 
    anchorEl, 
    open, 
    onClose, 
    notifications, 
    onMarkAsRead, 
    onMarkAllAsRead,
    onClearAll 
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getNotificationStyle = (notification) => ({
        backgroundColor: notification.read 
            ? 'transparent'
            : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
        transition: theme.transitions.create('background-color'),
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return theme.palette.error.main;
            case 'medium':
                return theme.palette.warning.main;
            default:
                return theme.palette.text.secondary;
        }
    };

    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days === 1) return 'yesterday';
        return date.toLocaleDateString();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
                elevation: 3,
                sx: {
                    width: 360,
                    maxHeight: 480,
                    overflow: 'auto'
                }
            }}
        >
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Typography variant="h6">Notifications</Typography>
                <Box>
                    <IconButton 
                        size="small" 
                        onClick={onMarkAllAsRead}
                        title="Mark all as read"
                    >
                        <DoneAllIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={onClearAll}
                        title="Clear all"
                    >
                        <DeleteSweepIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {notifications.length === 0 ? (
                <MenuItem disabled>
                    <ListItemText 
                        primary="No notifications"
                        secondary="You're all caught up!"
                    />
                </MenuItem>
            ) : (
                notifications.map(notification => (
                    <MenuItem
                        key={notification.id}
                        onClick={() => onMarkAsRead(notification.id)}
                        sx={getNotificationStyle(notification)}
                    >
                        <ListItemIcon sx={{ fontSize: 24 }}>
                            {notification.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography 
                                    variant="body1"
                                    color={getPriorityColor(notification.priority)}
                                    sx={{ fontWeight: notification.read ? 400 : 600 }}
                                >
                                    {notification.message}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" color="text.secondary">
                                    {formatTimestamp(notification.timestamp)}
                                </Typography>
                            }
                        />
                    </MenuItem>
                ))
            )}
        </Menu>
    );
};

export default NotificationMenu; 