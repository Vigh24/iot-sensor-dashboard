import React from 'react';
import { 
    Box, 
    ToggleButton, 
    ToggleButtonGroup, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Slider,
    Tooltip
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RadarIcon from '@mui/icons-material/RadioButtonChecked';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';

const ChartOptions = ({ 
    chartType, 
    onChartTypeChange, 
    timeRange, 
    onTimeRangeChange,
    smoothing,
    onSmoothingChange 
}) => {
    return (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>Chart Options</Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Chart Type Selection */}
                <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Chart Type
                    </Typography>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={(e, value) => value && onChartTypeChange(value)}
                        size="small"
                    >
                        <ToggleButton value="line" aria-label="line chart">
                            <Tooltip title="Line Chart">
                                <TimelineIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="area" aria-label="area chart">
                            <Tooltip title="Area Chart">
                                <ShowChartIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="stackedArea" aria-label="stacked area chart">
                            <Tooltip title="Stacked Area">
                                <StackedBarChartIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="bar" aria-label="bar chart">
                            <Tooltip title="Bar Chart">
                                <BarChartIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="radar" aria-label="radar chart">
                            <Tooltip title="Radar Chart">
                                <RadarIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="composed" aria-label="composed chart">
                            <Tooltip title="Composed Chart">
                                <MultilineChartIcon />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="multiLine" aria-label="multi line chart">
                            <Tooltip title="Multi Line">
                                <BubbleChartIcon />
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Time Range Selection */}
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => onTimeRangeChange(e.target.value)}
                        size="small"
                        label="Time Range"
                    >
                        <MenuItem value={5}>Last 5 minutes</MenuItem>
                        <MenuItem value={15}>Last 15 minutes</MenuItem>
                        <MenuItem value={30}>Last 30 minutes</MenuItem>
                        <MenuItem value={60}>Last 1 hour</MenuItem>
                    </Select>
                </FormControl>

                {/* Smoothing Factor */}
                <Box sx={{ width: 200 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Smoothing
                    </Typography>
                    <Slider
                        value={smoothing}
                        onChange={(e, value) => onSmoothingChange(value)}
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                        size="small"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ChartOptions; 