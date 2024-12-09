import React, { useState, useRef } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestoreIcon from '@mui/icons-material/Restore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ChartDownloadButton from './ChartDownloadButton';
import ChartCustomization from './ChartCustomization';

const InteractiveChart = ({ children, data, title }) => {
    const chartRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            chartRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <Paper
            ref={chartRef}
            sx={{
                p: 2,
                position: 'relative',
                height: isFullscreen ? '100vh' : '400px'
            }}
        >
            <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                <ChartDownloadButton
                    chartRef={chartRef}
                    data={data}
                    title={title}
                />
                <Tooltip title="Toggle Fullscreen">
                    <IconButton onClick={toggleFullscreen}>
                        <FullscreenIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {children}
        </Paper>
    );
};

export default InteractiveChart; 