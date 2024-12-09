import React, { useState } from 'react';
import { 
    Button, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { saveSvgAsPng } from 'save-svg-as-png';
import * as XLSX from 'xlsx';

const ChartDownloadButton = ({ chartRef, data, title }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadAsImage = () => {
        const svgElement = chartRef.current.container.children[0];
        saveSvgAsPng(svgElement, `${title}-chart.png`, {
            scale: 2,
            backgroundColor: 'white'
        });
        handleClose();
    };

    const downloadAsExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);
        XLSX.writeFile(wb, `${title}-data.xlsx`);
        handleClose();
    };

    const downloadAsCSV = () => {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}-data.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        handleClose();
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleClick}
                size="small"
            >
                Export
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={downloadAsImage}>
                    <ListItemIcon>
                        <ImageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download as PNG</ListItemText>
                </MenuItem>
                <MenuItem onClick={downloadAsExcel}>
                    <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download as Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={downloadAsCSV}>
                    <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download as CSV</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ChartDownloadButton; 