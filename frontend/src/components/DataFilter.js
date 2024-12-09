import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Tooltip,
    Paper
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const DataFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        sensorType: 'all',
        valueRange: { min: '', max: '' },
        dateRange: { start: '', end: '' }
    });

    const handleFilterChange = (type, value) => {
        const newFilters = { ...filters, [type]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            sensorType: 'all',
            valueRange: { min: '', max: '' },
            dateRange: { start: '', end: '' }
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Search */}
                <TextField
                    size="small"
                    label="Search"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                />

                {/* Sensor Type */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sensor Type</InputLabel>
                    <Select
                        value={filters.sensorType}
                        label="Sensor Type"
                        onChange={(e) => handleFilterChange('sensorType', e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="temperature">Temperature</MenuItem>
                        <MenuItem value="humidity">Humidity</MenuItem>
                        <MenuItem value="pressure">Pressure</MenuItem>
                    </Select>
                </FormControl>

                {/* Value Range */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        size="small"
                        label="Min Value"
                        type="number"
                        value={filters.valueRange.min}
                        onChange={(e) => handleFilterChange('valueRange', {
                            ...filters.valueRange,
                            min: e.target.value
                        })}
                        sx={{ width: 100 }}
                    />
                    <TextField
                        size="small"
                        label="Max Value"
                        type="number"
                        value={filters.valueRange.max}
                        onChange={(e) => handleFilterChange('valueRange', {
                            ...filters.valueRange,
                            max: e.target.value
                        })}
                        sx={{ width: 100 }}
                    />
                </Box>

                {/* Active Filters */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {filters.search && (
                        <Chip
                            label={`Search: ${filters.search}`}
                            onDelete={() => handleFilterChange('search', '')}
                            size="small"
                        />
                    )}
                    {filters.sensorType !== 'all' && (
                        <Chip
                            label={`Type: ${filters.sensorType}`}
                            onDelete={() => handleFilterChange('sensorType', 'all')}
                            size="small"
                        />
                    )}
                    {(filters.valueRange.min || filters.valueRange.max) && (
                        <Chip
                            label={`Range: ${filters.valueRange.min || '*'} - ${filters.valueRange.max || '*'}`}
                            onDelete={() => handleFilterChange('valueRange', { min: '', max: '' })}
                            size="small"
                        />
                    )}
                </Box>

                {/* Clear Filters */}
                <Tooltip title="Clear all filters">
                    <IconButton onClick={clearFilters} size="small">
                        <ClearIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    );
};

export default DataFilter; 