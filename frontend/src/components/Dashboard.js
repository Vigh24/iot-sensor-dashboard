import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Paper, Typography, Alert, Snackbar, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SensorCard from './SensorCard';
import DashboardControls from './DashboardControls';
import { createBeep, resumeAudioContext } from '../utils/sound';
import ChartOptions from './ChartOptions';
import { renderChart } from '../utils/chartRenderer';

const Dashboard = ({ darkMode }) => {
    const [sensorData, setSensorData] = useState({
        temperature: [],
        humidity: [],
        pressure: []
    });
    const [filteredData, setFilteredData] = useState({
        temperature: [],
        humidity: [],
        pressure: []
    });
    const [thresholds, setThresholds] = useState({
        temperature: { min: 15, max: 30 },
        humidity: { min: 30, max: 70 },
        pressure: { min: 980, max: 1020 }
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertBeep] = useState(createBeep());
    const [chartSettings, setChartSettings] = useState({
        type: 'line',
        timeRange: 15,
        smoothing: 0
    });

    // Initialize audio context on first user interaction
    useEffect(() => {
        const handleFirstInteraction = () => {
            resumeAudioContext();
            document.removeEventListener('click', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        return () => document.removeEventListener('click', handleFirstInteraction);
    }, []);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000');

        ws.onopen = () => {
            console.log('Frontend connected to WebSocket server');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Frontend received data:', data);

            if (data.type && data.value && !data.message) {
                checkThresholds(data);
                setSensorData(prevData => {
                    const newData = {
                        ...prevData,
                        [data.type]: [...(prevData[data.type] || []), {
                            time: new Date().toLocaleTimeString(),
                            value: data.value
                        }].slice(-20)
                    };
                    setFilteredData(newData);
                    return newData;
                });
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const getLineColor = (type) => {
        switch(type) {
            case 'temperature': return '#FF6B6B';
            case 'humidity': return '#4ECDC4';
            case 'pressure': return '#45B7D1';
            default: return '#8884d8';
        }
    };

    const checkThresholds = (data) => {
        if (data.type && thresholds[data.type]) {
            const { min, max } = thresholds[data.type];
            if (data.value < min) {
                showAlert(`${data.type} is too low: ${data.value} ${data.unit}`);
            } else if (data.value > max) {
                showAlert(`${data.type} is too high: ${data.value} ${data.unit}`);
            }
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertOpen(true);
        alertBeep.play().catch(err => console.log('Audio play failed:', err));
    };

    const handleDateRangeChange = (start, end) => {
        try {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.error('Invalid date format');
                return;
            }

            const filtered = Object.entries(sensorData).reduce((acc, [type, data]) => {
                acc[type] = data.filter(item => {
                    try {
                        const itemTime = new Date(item.time);
                        return itemTime >= startDate && itemTime <= endDate;
                    } catch (error) {
                        console.error('Error parsing item time:', error);
                        return false;
                    }
                });
                return acc;
            }, {});

            setFilteredData(filtered);
        } catch (error) {
            console.error('Date filtering error:', error);
        }
    };

    const handleThresholdChange = (newThresholds) => {
        setThresholds(newThresholds);
    };

    const handleChartTypeChange = (newType) => {
        setChartSettings(prev => ({ ...prev, type: newType }));
    };

    const handleTimeRangeChange = (newRange) => {
        setChartSettings(prev => ({ ...prev, timeRange: newRange }));
    };

    const handleSmoothingChange = (newSmoothing) => {
        setChartSettings(prev => ({ ...prev, smoothing: newSmoothing }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <DashboardControls
                sensorData={sensorData}
                onDateRangeChange={handleDateRangeChange}
                thresholds={thresholds}
                onThresholdChange={handleThresholdChange}
            />
            <ChartOptions 
                chartType={chartSettings.type}
                onChartTypeChange={handleChartTypeChange}
                timeRange={chartSettings.timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                smoothing={chartSettings.smoothing}
                onSmoothingChange={handleSmoothingChange}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <SensorCard 
                        title="Temperature"
                        value={filteredData.temperature[filteredData.temperature.length - 1]?.value || 0}
                        unit="°C"
                        type="temperature"
                        thresholds={thresholds}
                        darkMode={darkMode}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SensorCard 
                        title="Humidity"
                        value={filteredData.humidity[filteredData.humidity.length - 1]?.value || 0}
                        unit="%"
                        type="humidity"
                        thresholds={thresholds}
                        darkMode={darkMode}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SensorCard 
                        title="Pressure"
                        value={filteredData.pressure[filteredData.pressure.length - 1]?.value || 0}
                        unit="hPa"
                        type="pressure"
                        thresholds={thresholds}
                        darkMode={darkMode}
                    />
                </Grid>
                {Object.entries(filteredData).map(([type, data]) => (
                    <Grid item xs={12} key={type}>
                        <Paper sx={{ 
                            p: 3,
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                {type.charAt(0).toUpperCase() + type.slice(1)} History
                            </Typography>
                            <Box sx={{ 
                                flexGrow: 1, 
                                width: '100%', 
                                height: '100%',
                                minHeight: 300 
                            }}>
                                {renderChart(chartSettings.type, data, {
                                    smoothing: chartSettings.smoothing
                                }, darkMode)}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setAlertOpen(false)} 
                    severity="warning" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Dashboard;