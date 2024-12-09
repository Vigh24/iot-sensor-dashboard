import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationSystem = ({ notifications, onClose }) => {
    return (
        <div>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={index}
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={() => onClose(index)}
                >
                    <Alert 
                        severity={notification.type} 
                        variant="filled"
                        icon={<NotificationsIcon />}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </div>
    );
};

export default NotificationSystem; 