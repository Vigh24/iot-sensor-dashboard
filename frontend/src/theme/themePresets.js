import { alpha } from '@mui/material/styles';

export const themePresets = {
    light: {
        name: 'Light',
        palette: {
            mode: 'light',
            primary: { main: '#1976d2' },
            secondary: { main: '#dc004e' },
            background: {
                default: '#f5f5f5',
                paper: '#ffffff',
            }
        }
    },
    dark: {
        name: 'Dark',
        palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            }
        }
    },
    nightBlue: {
        name: 'Night Blue',
        palette: {
            mode: 'dark',
            primary: { main: '#4dabf5' },
            secondary: { main: '#ff9100' },
            background: {
                default: '#0a192f',
                paper: '#112240',
            }
        }
    },
    forest: {
        name: 'Forest',
        palette: {
            mode: 'dark',
            primary: { main: '#81c784' },
            secondary: { main: '#ffb74d' },
            background: {
                default: '#1b2815',
                paper: '#2c3c21',
            }
        }
    },
    sunset: {
        name: 'Sunset',
        palette: {
            mode: 'light',
            primary: { main: '#ff7043' },
            secondary: { main: '#ffd54f' },
            background: {
                default: '#fff8e1',
                paper: '#ffffff',
            }
        }
    }
};

export const getThemeOptions = (preset, customizations = {}) => {
    const baseTheme = themePresets[preset];
    
    return {
        ...baseTheme,
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition: 'background-color 0.5s ease, color 0.5s ease',
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
                        backgroundImage: 'none',
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: baseTheme.palette.mode === 'dark'
                            ? `0 4px 6px ${alpha('#000', 0.3)}`
                            : `0 4px 6px ${alpha('#000', 0.1)}`,
                    }
                }
            },
            ...customizations
        }
    };
}; 