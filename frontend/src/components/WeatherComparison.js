import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, CircularProgress, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const WeatherComparison = ({ sensorData }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your weather API key and location
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YOUR_API_KEY&units=metric`
                );
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
        return () => clearInterval(interval);
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Indoor vs Outdoor Conditions
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2">Temperature</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <Typography>
                                {sensorData.temperature[sensorData.temperature.length - 1]?.value.toFixed(1)}°C
                            </Typography>
                            <CompareArrowsIcon />
                            <Typography>
                                {weatherData?.main.temp.toFixed(1)}°C
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                {/* Add similar comparisons for humidity and pressure */}
            </Grid>
        </Paper>
    );
};

export default WeatherComparison; 