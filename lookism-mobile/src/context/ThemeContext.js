import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../services/firebaseService';

// Definir temas
const themes = {
    normal: {
        name: 'Normal',
        colors: {
            primary: '#667eea',
            background: '#ffffff',
            text: '#2d3748',
            textLight: '#718096',
            border: '#e2e8f0',
            cardBg: '#f7fafc',
        },
        fontSizes: {
            small: 14,
            normal: 18,
            large: 20,
            xlarge: 24,
            title: 32,
        },
    },
    highContrast: {
        name: 'Alto Contraste',
        colors: {
            primary: '#000000',
            background: '#ffff00',
            text: '#000000',
            textLight: '#333333',
            border: '#000000',
            cardBg: '#ffd700',
        },
        fontSizes: {
            small: 16,
            normal: 20,
            large: 24,
            xlarge: 28,
            title: 36,
        },
    },
    lowVision: {
        name: 'Baja Visión',
        colors: {
            primary: '#2d3748',
            background: '#f7fafc',
            text: '#000000',
            textLight: '#2d3748',
            border: '#2d3748',
            cardBg: '#ffffff',
        },
        fontSizes: {
            small: 18,
            normal: 24,
            large: 28,
            xlarge: 32,
            title: 40,
        },
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState('normal');

    useEffect(() => {
        loadThemeFromUser();
    }, []);

    const loadThemeFromUser = async () => {
        try {
            const user = await getCurrentUser();
            if (user && user.visionMode) {
                // Mapear visionMode a theme
                const themeMap = {
                    normal: 'normal',
                    low: 'lowVision',
                    blind: 'highContrast', // Para ciegos usamos alto contraste para cualquier visión residual
                };
                setCurrentTheme(themeMap[user.visionMode] || 'normal');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const changeTheme = (themeName) => {
        if (themes[themeName]) {
            setCurrentTheme(themeName);
        }
    };

    const theme = themes[currentTheme];

    return (
        <ThemeContext.Provider value={{ theme, currentTheme, changeTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('use Theme must be used within ThemeProvider');
    }
    return context;
};

export default ThemeContext;
