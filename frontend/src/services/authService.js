import { saveToLocalStorage, loadFromLocalStorage } from './storageService';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Mock credentials for testing
const MOCK_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

export const login = async (username, password) => {
    try {
        // Mock authentication
        if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
            const mockData = {
                token: 'mock-jwt-token',
                user: {
                    username: username,
                    role: 'admin'
                }
            };
            
            saveToLocalStorage(AUTH_TOKEN_KEY, mockData.token);
            saveToLocalStorage(USER_KEY, mockData.user);
            return mockData.user;
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
    return !!loadFromLocalStorage(AUTH_TOKEN_KEY);
}; 