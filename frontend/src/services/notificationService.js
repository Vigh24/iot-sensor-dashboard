import { createBeep } from '../utils/sound';

class NotificationService {
    constructor() {
        this.listeners = new Set();
        this.notifications = [];
        this.beep = createBeep();
        this.soundEnabled = true; // Default value
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(notification) {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification,
            icon: notification.icon || getNotificationIcon(notification.type)
        };
        
        this.notifications.unshift(newNotification);
        this.listeners.forEach(listener => listener(this.notifications));
        
        // Play sound for important notifications unless silenced or sound is disabled
        if (notification.priority === 'high' && !notification.silent && this.soundEnabled) {
            this.beep.play().catch(error => {
                console.warn('Failed to play notification sound:', error);
            });
        }
    }

    markAsRead(notificationId) {
        this.notifications = this.notifications.map(notification =>
            notification.id === notificationId
                ? { ...notification, read: true }
                : notification
        );
        this.listeners.forEach(listener => listener(this.notifications));
    }

    markAllAsRead() {
        this.notifications = this.notifications.map(notification => ({
            ...notification,
            read: true
        }));
        this.listeners.forEach(listener => listener(this.notifications));
    }

    clearAll() {
        this.notifications = [];
        this.listeners.forEach(listener => listener(this.notifications));
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }
}

export const notificationService = new NotificationService();

// Example notification types
export const NOTIFICATION_TYPES = {
    THRESHOLD_ALERT: 'threshold_alert',
    SYSTEM_STATUS: 'system_status',
    CONNECTION_STATUS: 'connection_status',
    DATA_EXPORT: 'data_export'
};

// Helper function to create notifications
export const createNotification = (type, message, priority = 'normal', silent = false) => ({
    type,
    message,
    priority,
    silent,
    icon: getNotificationIcon(type)
});

const getNotificationIcon = (type) => {
    switch (type) {
        case NOTIFICATION_TYPES.THRESHOLD_ALERT:
            return '⚠️';
        case NOTIFICATION_TYPES.SYSTEM_STATUS:
            return '🔧';
        case NOTIFICATION_TYPES.CONNECTION_STATUS:
            return '🔌';
        case NOTIFICATION_TYPES.DATA_EXPORT:
            return '📊';
        default:
            return '📝';
    }
}; 