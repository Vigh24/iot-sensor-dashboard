import React from 'react';
import { Paper, Typography, Grid, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';

const DataAnalysisPanel = ({ sensorData }) => {
    const analyzeData = (data) => {
        if (!data || data.length < 2) return null;
        
        const values = data.map(item => item.value);
        const trend = values[values.length - 1] - values[0];
        const percentChange = ((trend / values[0]) * 100).toFixed(1);
        
        // Calculate rate of change
        const timeSpan = (new Date(data[data.length - 1].time) - new Date(data[0].time)) / 1000; // in seconds
        const rateOfChange = (trend / timeSpan).toFixed(3);

        // Detect patterns
        const patterns = detectPatterns(values);

        return {
            trend,
            percentChange,
            rateOfChange,
            patterns,
            volatility: calculateVolatility(values)
        };
    };

    const detectPatterns = (values) => {
        const patterns = [];
        // Detect upward trend
        if (values[values.length - 1] > values[values.length - 2]) {
            patterns.push('Increasing');
        }
        // Detect downward trend
        if (values[values.length - 1] < values[values.length - 2]) {
            patterns.push('Decreasing');
        }
        // Detect stability
        const recentValues = values.slice(-5);
        const isStable = recentValues.every(v => 
            Math.abs(v - recentValues[0]) < recentValues[0] * 0.05
        );
        if (isStable) patterns.push('Stable');

        return patterns;
    };

    const calculateVolatility = (values) => {
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return Math.sqrt(variance).toFixed(2);
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Real-time Analysis</Typography>
            <Grid container spacing={3}>
                {Object.entries(sensorData).map(([type, data]) => {
                    const analysis = analyzeData(data);
                    if (!analysis) return null;

                    return (
                        <Grid item xs={12} md={4} key={type}>
                            <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {analysis.trend >= 0 ? 
                                        <TrendingUpIcon color="success" /> : 
                                        <TrendingDownIcon color="error" />
                                    }
                                    <Typography sx={{ ml: 1 }}>
                                        {analysis.percentChange}% change
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Rate of change: {analysis.rateOfChange}/s
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Volatility: {analysis.volatility}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {analysis.patterns.map((pattern, index) => (
                                        <Chip
                                            key={index}
                                            label={pattern}
                                            size="small"
                                            icon={<TimelineIcon />}
                                            color={
                                                pattern === 'Stable' ? 'success' :
                                                pattern === 'Increasing' ? 'primary' : 'error'
                                            }
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
};

export default DataAnalysisPanel; 