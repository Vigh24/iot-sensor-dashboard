import { useEffect } from 'react';

export const useKeyboardShortcuts = (actions) => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ctrl + E: Export Data
            if (event.ctrlKey && event.key === 'e') {
                event.preventDefault();
                actions.exportData();
            }
            // Ctrl + Z: Reset Zoom
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                actions.resetZoom();
            }
            // Ctrl + F: Toggle Fullscreen
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                actions.toggleFullscreen();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [actions]);
}; 