import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Alert,
    Snackbar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';

const DashboardControls = ({ sensorData, onDateRangeChange, thresholds, onThresholdChange }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [thresholdDialog, setThresholdDialog] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tempThresholds, setTempThresholds] = useState(thresholds);
    const [exportAnchorEl, setExportAnchorEl] = useState(null);

    const handleExportClick = (event) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleExportClose = () => {
        setExportAnchorEl(null);
    };

    const formatDataForExport = (format) => {
        const data = Object.entries(sensorData).reduce((acc, [type, values]) => {
            acc[type] = values.map(item => ({
                type,
                value: item.value,
                time: item.time,
                timestamp: new Date().toISOString()
            }));
            return acc;
        }, {});

        switch (format) {
            case 'txt':
                return Object.entries(data).reduce((acc, [type, values]) => {
                    acc += `\n=== ${type.toUpperCase()} ===\n`;
                    values.forEach(item => {
                        acc += `Time: ${item.time}, Value: ${item.value}\n`;
                    });
                    return acc;
                }, '');

            case 'csv':
                let csv = 'Type,Time,Value\n';
                Object.entries(data).forEach(([type, values]) => {
                    values.forEach(item => {
                        csv += `${type},${item.time},${item.value}\n`;
                    });
                });
                return csv;

            case 'json':
            default:
                return JSON.stringify(data, null, 2);
        }
    };

    const handleExport = (format) => {
        try {
            const formattedData = formatDataForExport(format);
            const mimeTypes = {
                json: 'application/json',
                txt: 'text/plain',
                csv: 'text/csv'
            };

            const extensions = {
                json: 'json',
                txt: 'txt',
                csv: 'csv'
            };

            const blob = new Blob([formattedData], { 
                type: mimeTypes[format] || 'text/plain'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sensor-data-${new Date().toISOString().slice(0,19)}.${extensions[format]}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            handleExportClose();
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const handleDateRangeSubmit = () => {
        if (!startDate || !endDate) {
            return; // Don't process if dates are empty
        }

        try {
            // Format the date strings properly
            const formattedStart = new Date(startDate).toISOString();
            const formattedEnd = new Date(endDate).toISOString();
            onDateRangeChange(formattedStart, formattedEnd);
        } catch (error) {
            console.error('Date range error:', error);
            // You could show an error message to the user here
        }
    };

    const handleThresholdSubmit = () => {
        onThresholdChange(tempThresholds);
        setThresholdDialog(false);
    };

    return (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
                type="datetime-local"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ width: 200 }}
                InputLabelProps={{ shrink: true }}
                defaultValue={new Date(Date.now() - 3600000).toISOString().slice(0,16)}
            />
            <TextField
                type="datetime-local"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ width: 200 }}
                InputLabelProps={{ shrink: true }}
                defaultValue={new Date().toISOString().slice(0,16)}
            />
            <Button 
                variant="contained" 
                onClick={handleDateRangeSubmit}
                sx={{ height: 40 }}
            >
                Apply Range
            </Button>
            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportClick}
                sx={{ height: 40 }}
            >
                Export Data
            </Button>
            <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportClose}
            >
                <MenuItem onClick={() => handleExport('json')}>
                    <ListItemIcon>
                        <CodeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export as JSON</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('csv')}>
                    <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('txt')}>
                    <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export as TXT</ListItemText>
                </MenuItem>
            </Menu>
            <Button
                variant="outlined"
                startIcon={<NotificationsIcon />}
                onClick={() => setThresholdDialog(true)}
                sx={{ height: 40 }}
            >
                Set Alerts
            </Button>

            <Dialog open={thresholdDialog} onClose={() => setThresholdDialog(false)}>
                <DialogTitle>Set Alert Thresholds</DialogTitle>
                <DialogContent>
                    {Object.entries(tempThresholds).map(([type, { min, max }]) => (
                        <Box key={type} sx={{ mb: 2 }}>
                            <TextField
                                label={`${type} Min`}
                                type="number"
                                value={min}
                                onChange={(e) => setTempThresholds(prev => ({
                                    ...prev,
                                    [type]: { ...prev[type], min: parseFloat(e.target.value) }
                                }))}
                                sx={{ mr: 2 }}
                            />
                            <TextField
                                label={`${type} Max`}
                                type="number"
                                value={max}
                                onChange={(e) => setTempThresholds(prev => ({
                                    ...prev,
                                    [type]: { ...prev[type], max: parseFloat(e.target.value) }
                                }))}
                            />
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setThresholdDialog(false)}>Cancel</Button>
                    <Button onClick={handleThresholdSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                <Alert severity="warning" onClose={() => setAlertOpen(false)}>
                    Sensor value exceeded threshold!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DashboardControls; 