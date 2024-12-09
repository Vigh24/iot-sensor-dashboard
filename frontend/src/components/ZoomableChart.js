import React, { useState } from 'react';
import { ReferenceArea, Brush, ResponsiveContainer } from 'recharts';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestoreIcon from '@mui/icons-material/Restore';
import PanToolIcon from '@mui/icons-material/PanTool';

const ZoomableChart = ({ children, ChartComponent, data }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    const [zoomState, setZoomState] = useState({
        left: 'dataMin',
        right: 'dataMax',
        refAreaLeft: '',
        refAreaRight: '',
        isPanning: false,
        animation: true
    });

    const handleZoom = (domain) => {
        if (zoomState.refAreaLeft === zoomState.refAreaRight || !zoomState.refAreaRight) {
            setZoomState(prev => ({
                ...prev,
                refAreaLeft: '',
                refAreaRight: ''
            }));
            return;
        }

        // Ensure left is less than right
        const [left, right] = [zoomState.refAreaLeft, zoomState.refAreaRight].sort();

        setZoomState(prev => ({
            ...prev,
            left,
            right,
            refAreaLeft: '',
            refAreaRight: '',
            animation: true
        }));
    };

    const zoomIn = () => {
        const range = data.length;
        const middle = Math.floor(range / 2);
        const newLeft = data[Math.max(0, middle - Math.floor(range / 4))].time;
        const newRight = data[Math.min(range - 1, middle + Math.floor(range / 4))].time;

        setZoomState(prev => ({
            ...prev,
            left: newLeft,
            right: newRight,
            animation: true
        }));
    };

    const zoomOut = () => {
        setZoomState(prev => ({
            ...prev,
            left: 'dataMin',
            right: 'dataMax',
            animation: true
        }));
    };

    const togglePan = () => {
        setZoomState(prev => ({
            ...prev,
            isPanning: !prev.isPanning
        }));
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', pb: 5 }}>
            <Box sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                zIndex: 1,
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
                borderRadius: 1,
                padding: 0.5,
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(4px)',
                transition: theme.transitions.create(['background-color', 'border-color'], {
                    duration: theme.transitions.duration.short,
                })
            }}>
                <Tooltip title="Zoom In">
                    <IconButton 
                        size="small" 
                        onClick={zoomIn}
                        sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <ZoomInIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                    <IconButton 
                        size="small" 
                        onClick={zoomOut}
                        sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <ZoomOutIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reset">
                    <IconButton 
                        size="small" 
                        onClick={zoomOut}
                        sx={{ 
                            color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <RestoreIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={zoomState.isPanning ? "Disable Pan" : "Enable Pan"}>
                    <IconButton 
                        size="small" 
                        onClick={togglePan}
                        sx={{ 
                            color: zoomState.isPanning 
                                ? theme.palette.primary.main 
                                : (isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'),
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <PanToolIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={350}>
                <ChartComponent
                    data={data}
                    margin={{ top: 10, right: 30, left: 10, bottom: 70 }}
                    onMouseDown={(e) => !zoomState.isPanning && e && setZoomState(prev => ({ 
                        ...prev, 
                        refAreaLeft: e.activeLabel 
                    }))}
                    onMouseMove={(e) => {
                        if (zoomState.isPanning && e) {
                            // Implement panning logic
                        } else if (zoomState.refAreaLeft && e) {
                            setZoomState(prev => ({ 
                                ...prev, 
                                refAreaRight: e.activeLabel 
                            }));
                        }
                    }}
                    onMouseUp={handleZoom}
                >
                    {React.Children.map(children, child => 
                        React.cloneElement(child, {
                            isAnimationActive: zoomState.animation
                        })
                    )}
                    <Brush 
                        dataKey="time"
                        height={30}
                        stroke={isDarkMode ? '#90caf9' : '#8884d8'}
                        fill={isDarkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(136, 132, 216, 0.1)'}
                        y={280}
                        onChange={(domain) => {
                            setZoomState(prev => ({
                                ...prev,
                                left: domain.startIndex,
                                right: domain.endIndex,
                                animation: false
                            }));
                        }}
                        travellerWidth={10}
                        strokeWidth={1}
                    />
                    {zoomState.refAreaLeft && zoomState.refAreaRight ? (
                        <ReferenceArea
                            x1={zoomState.refAreaLeft}
                            x2={zoomState.refAreaRight}
                            strokeOpacity={0.3}
                            fill={isDarkMode ? '#90caf9' : '#8884d8'}
                            fillOpacity={0.3}
                        />
                    ) : null}
                </ChartComponent>
            </ResponsiveContainer>
        </Box>
    );
};

export default ZoomableChart; 