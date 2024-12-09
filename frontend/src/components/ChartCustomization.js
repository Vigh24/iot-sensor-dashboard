import React from 'react';
import {
    Box,
    Typography,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    ColorPicker
} from '@mui/material';

const ChartCustomization = ({ 
    options, 
    onOptionsChange 
}) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Chart Customization
            </Typography>
            
            {/* Line Style */}
            <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Line Style</InputLabel>
                <Select
                    value={options.lineStyle}
                    onChange={(e) => onOptionsChange('lineStyle', e.target.value)}
                >
                    <MenuItem value="linear">Linear</MenuItem>
                    <MenuItem value="curved">Curved</MenuItem>
                    <MenuItem value="stepped">Stepped</MenuItem>
                </Select>
            </FormControl>

            {/* Line Thickness */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                    Line Thickness
                </Typography>
                <Slider
                    value={options.lineWidth}
                    onChange={(e, value) => onOptionsChange('lineWidth', value)}
                    min={1}
                    max={5}
                    step={0.5}
                />
            </Box>

            {/* Data Points */}
            <FormControlLabel
                control={
                    <Switch
                        checked={options.showDataPoints}
                        onChange={(e) => onOptionsChange('showDataPoints', e.target.checked)}
                    />
                }
                label="Show Data Points"
            />

            {/* Grid Lines */}
            <FormControlLabel
                control={
                    <Switch
                        checked={options.showGrid}
                        onChange={(e) => onOptionsChange('showGrid', e.target.checked)}
                    />
                }
                label="Show Grid Lines"
            />

            {/* Color Picker */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                    Chart Color
                </Typography>
                <ColorPicker
                    value={options.color}
                    onChange={(color) => onOptionsChange('color', color)}
                />
            </Box>
        </Box>
    );
};

export default ChartCustomization; 