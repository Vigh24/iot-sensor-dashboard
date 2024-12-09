import React, { useState } from 'react';
import { Dialog, TextField, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CommandPalette = ({ isOpen, onClose, commands }) => {
    const [search, setSearch] = useState('');

    const filteredCommands = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <TextField
                autoFocus
                fullWidth
                placeholder="Type a command..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
                sx={{ p: 2 }}
            />
            <List>
                {filteredCommands.map((cmd, index) => (
                    <ListItem
                        key={index}
                        button
                        onClick={() => {
                            cmd.action();
                            onClose();
                        }}
                    >
                        <ListItemIcon>{cmd.icon}</ListItemIcon>
                        <ListItemText 
                            primary={cmd.name}
                            secondary={cmd.description}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
};

export default CommandPalette; 