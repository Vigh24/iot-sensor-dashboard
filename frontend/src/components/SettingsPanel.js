import React from 'react';
import {
    Box,
    Typography,
    Switch,
    FormGroup,
    FormControlLabel,
    Divider,
    useTheme,
    Slider,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';

const SettingsPanel = ({ 
    onSettingChange,
    settings = {
        notifications: true,
        soundEnabled: true,
        dataRefreshInterval: 5,
        chartUpdateInterval: 1,
        temperatureUnit: 'celsius'
    }
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                General Settings
            </Typography>
            
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.notifications}
                            onChange={(e) => onSettingChange?.('notifications', e.target.checked)}
                        />
                    }
                    label="Enable Notifications"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.soundEnabled}
                            onChange={(e) => onSettingChange?.('soundEnabled', e.target.checked)}
                        />
                    }
                    label="Enable Sound Effects"
                />
            </FormGroup>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
                Display Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                    Data Refresh Interval (seconds)
                </Typography>
                <Slider
                    value={settings.dataRefreshInterval}
                    onChange={(_, value) => onSettingChange?.('dataRefreshInterval', value)}
                    min={1}
                    max={60}
                    valueLabelDisplay="auto"
                    marks={[
                        { value: 1, label: '1s' },
                        { value: 30, label: '30s' },
                        { value: 60, label: '60s' }
                    ]}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                    Chart Update Interval (seconds)
                </Typography>
                <Slider
                    value={settings.chartUpdateInterval}
                    onChange={(_, value) => onSettingChange?.('chartUpdateInterval', value)}
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    marks={[
                        { value: 1, label: '1s' },
                        { value: 5, label: '5s' },
                        { value: 10, label: '10s' }
                    ]}
                />
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Temperature Unit</InputLabel>
                <Select
                    value={settings.temperatureUnit}
                    label="Temperature Unit"
                    onChange={(e) => onSettingChange?.('temperatureUnit', e.target.value)}
                >
                    <MenuItem value="celsius">Celsius (°C)</MenuItem>
                    <MenuItem value="fahrenheit">Fahrenheit (°F)</MenuItem>
                    <MenuItem value="kelvin">Kelvin (K)</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Note: Some settings may require a page refresh to take effect.
            </Typography>
        </Box>
    );
};

export default SettingsPanel; 