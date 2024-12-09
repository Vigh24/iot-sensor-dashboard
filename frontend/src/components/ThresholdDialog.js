import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Slider,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ThresholdDialog = ({ open, onClose, thresholds, onSave }) => {
    const [tempThresholds, setTempThresholds] = useState(thresholds);

    const handleSliderChange = (type, minmax) => (event, newValue) => {
        setTempThresholds(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [minmax]: newValue
            }
        }));
    };

    const getMarks = (type) => {
        switch(type) {
            case 'temperature':
                return [
                    { value: 0, label: '0°C' },
                    { value: 50, label: '50°C' }
                ];
            case 'humidity':
                return [
                    { value: 0, label: '0%' },
                    { value: 100, label: '100%' }
                ];
            case 'pressure':
                return [
                    { value: 900, label: '900hPa' },
                    { value: 1100, label: '1100hPa' }
                ];
            default:
                return [];
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Set Alert Thresholds
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {Object.entries(tempThresholds).map(([type, { min, max }]) => (
                    <Box key={type} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Typography>
                        
                        <Typography gutterBottom>Minimum Value</Typography>
                        <Slider
                            value={min}
                            onChange={handleSliderChange(type, 'min')}
                            marks={getMarks(type)}
                            valueLabelDisplay="auto"
                            min={type === 'pressure' ? 900 : 0}
                            max={type === 'pressure' ? 1100 : type === 'humidity' ? 100 : 50}
                        />

                        <Typography gutterBottom>Maximum Value</Typography>
                        <Slider
                            value={max}
                            onChange={handleSliderChange(type, 'max')}
                            marks={getMarks(type)}
                            valueLabelDisplay="auto"
                            min={type === 'pressure' ? 900 : 0}
                            max={type === 'pressure' ? 1100 : type === 'humidity' ? 100 : 50}
                        />
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={() => {
                        onSave(tempThresholds);
                        onClose();
                    }} 
                    variant="contained"
                >
                    Save Thresholds
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ThresholdDialog; 