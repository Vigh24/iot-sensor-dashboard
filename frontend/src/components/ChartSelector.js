import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

const ChartSelector = ({ chartType, onChartTypeChange }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={onChartTypeChange}
                aria-label="chart type"
            >
                <ToggleButton value="line" aria-label="line chart">
                    <TimelineIcon />
                </ToggleButton>
                <ToggleButton value="bar" aria-label="bar chart">
                    <BarChartIcon />
                </ToggleButton>
                <ToggleButton value="pie" aria-label="pie chart">
                    <PieChartIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default ChartSelector; 