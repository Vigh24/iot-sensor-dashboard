import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatisticsPanel = ({ sensorData }) => {
    const calculateStats = (data) => {
        if (!data || data.length === 0) return { min: 0, max: 0, avg: 0, trend: 0 };
        const values = data.map(item => item.value);
        const trend = values[values.length - 1] - values[0];
        
        return {
            min: Math.min(...values).toFixed(2),
            max: Math.max(...values).toFixed(2),
            avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
            trend: trend.toFixed(2)
        };
    };

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(sensorData).map(([type, data]) => {
                const stats = calculateStats(data);
                return (
                    <Grid item xs={12} md={4} key={type}>
                        <Paper sx={{ p: 2, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <Typography variant="h6" gutterBottom>
                                {type.charAt(0).toUpperCase() + type.slice(1)} Analytics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Average</Typography>
                                        <Typography variant="h6">{stats.avg}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Trend</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {parseFloat(stats.trend) >= 0 ? (
                                                <TrendingUpIcon color="success" />
                                            ) : (
                                                <TrendingDownIcon color="error" />
                                            )}
                                            <Typography variant="h6">{Math.abs(stats.trend)}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Min</Typography>
                                        <Typography variant="h6">{stats.min}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Max</Typography>
                                        <Typography variant="h6">{stats.max}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
        </Grid>
    );
};

export default StatisticsPanel; 