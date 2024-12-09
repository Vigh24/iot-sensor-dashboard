import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import SpeedIcon from '@mui/icons-material/Speed';

const SensorCard = ({ title, value, unit, type, thresholds, darkMode }) => {
    const getIcon = () => {
        switch (type) {
            case 'temperature':
                return <ThermostatIcon sx={{ fontSize: 40 }} />;
            case 'humidity':
                return <OpacityIcon sx={{ fontSize: 40 }} />;
            case 'pressure':
                return <SpeedIcon sx={{ fontSize: 40 }} />;
            default:
                return null;
        }
    };

    const getProgress = () => {
        switch (type) {
            case 'temperature':
                return ((value - 15) / (30 - 15)) * 100; // Assuming range 15-30°C
            case 'humidity':
                return value; // 0-100%
            case 'pressure':
                return ((value - 980) / (1020 - 980)) * 100; // Assuming range 980-1020 hPa
            default:
                return 0;
        }
    };

    const getGradient = () => {
        const darkModifier = darkMode ? '0.8' : '1'; // Reduce opacity in dark mode
        switch (type) {
            case 'temperature':
                return `linear-gradient(135deg, rgba(255,107,107,${darkModifier}) 0%, rgba(255,230,109,${darkModifier}) 100%)`;
            case 'humidity':
                return `linear-gradient(135deg, rgba(78,205,196,${darkModifier}) 0%, rgba(85,98,112,${darkModifier}) 100%)`;
            case 'pressure':
                return `linear-gradient(135deg, rgba(69,183,209,${darkModifier}) 0%, rgba(44,62,80,${darkModifier}) 100%)`;
            default:
                return 'none';
        }
    };

    const isOutOfRange = () => {
        if (!thresholds || !thresholds[type]) return false;
        const { min, max } = thresholds[type];
        return value < min || value > max;
    };

    return (
        <Paper 
            sx={{ 
                p: 3, 
                height: '100%',
                background: getGradient(),
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: isOutOfRange() ? 'pulse 2s infinite' : 'none',
                border: isOutOfRange() ? '2px solid #ff4444' : 'none',
                '&:hover': {
                    transform: 'translateY(-5px)'
                }
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getIcon()}
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                    {value.toFixed(2)}
                    <Typography component="span" variant="h5" sx={{ ml: 1, opacity: 0.8 }}>
                        {unit}
                    </Typography>
                </Typography>
                <LinearProgress 
                    variant="determinate" 
                    value={getProgress()} 
                    sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: 'rgba(255,255,255,0.8)'
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};

export default SensorCard;