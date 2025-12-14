import React, { createContext, useState, useContext, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speak, stop } from '../utils/voice';
import { getCurrentUser, updateVisionMode } from '../services/firebaseService';

// Definición de modos de visión
const VISION_MODES = {
    GOOD: {
        id: 'good',
        name: 'Buena visión',
        description: 'Sin lector de pantalla. Interfaz normal.',
        screenReader: false,
        screenReaderToggleable: false,
        theme: 'normal',
        fontSize: 'normal',
        contrast: 'normal',
    },
    LOW: {
        id: 'low',
        name: 'Baja visión',
        description: 'Alto contraste, texto grande. Lector opcional.',
        screenReader: false, // Por defecto OFF, usuario puede activar
        screenReaderToggleable: true,
        theme: 'highContrast',
        fontSize: 'large',
        contrast: 'high',
    },
    BLIND: {
        id: 'blind',
        name: 'Ceguera',
        description: 'Lector de pantalla obligatorio. Navegación por voz.',
        screenReader: true, // OBLIGATORIO
        screenReaderToggleable: false,
        theme: 'highContrast',
        fontSize: 'large',
        contrast: 'high',
    },
};

// Temas de color basados en modo
const THEMES = {
    normal: {
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
            normal: 22,
            large: 26,
            xlarge: 30,
            title: 38,
        },
    },
};

const AccessibilityContext = createContext();

const STORAGE_KEYS = {
    VISION_MODE: '@lookism:vision_mode',
    SCREEN_READER_ENABLED: '@lookism:screen_reader_enabled',
};

export const AccessibilityProvider = ({ children }) => {
    const [visionMode, setVisionMode] = useState(VISION_MODES.GOOD);
    const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
    const [isSystemScreenReaderEnabled, setIsSystemScreenReaderEnabled] = useState(false);

    useEffect(() => {
        loadSettings();
        checkSystemScreenReader();
    }, []);

    // Verificar si el lector de pantalla del sistema está activo
    const checkSystemScreenReader = async () => {
        try {
            const enabled = await AccessibilityInfo.isScreenReaderEnabled();
            setIsSystemScreenReaderEnabled(enabled);
        } catch (error) {
            console.error('Error checking screen reader:', error);
        }
    };

    // Cargar configuración guardada
    const loadSettings = async () => {
        try {
            const savedMode = await AsyncStorage.getItem(STORAGE_KEYS.VISION_MODE);
            const savedScreenReader = await AsyncStorage.getItem(STORAGE_KEYS.SCREEN_READER_ENABLED);

            if (savedMode) {
                const mode = Object.values(VISION_MODES).find(m => m.id === savedMode);
                if (mode) {
                    setVisionMode(mode);
                    // Si el modo es BLIND, el lector siempre está activo
                    if (mode.id === 'blind') {
                        setScreenReaderEnabled(true);
                    } else if (savedScreenReader) {
                        setScreenReaderEnabled(JSON.parse(savedScreenReader));
                    }
                }
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
    };

    // Cambiar modo de visión
    const changeVisionMode = async (modeId) => {
        const mode = Object.values(VISION_MODES).find(m => m.id === modeId);
        if (!mode) return;

        setVisionMode(mode);
        await AsyncStorage.setItem(STORAGE_KEYS.VISION_MODE, modeId);

        // Actualizar lector según el modo
        if (mode.id === 'blind') {
            setScreenReaderEnabled(true);
            await AsyncStorage.setItem(STORAGE_KEYS.SCREEN_READER_ENABLED, 'true');
        } else if (mode.id === 'good') {
            setScreenReaderEnabled(false);
            await AsyncStorage.setItem(STORAGE_KEYS.SCREEN_READER_ENABLED, 'false');
        }

        // Guardar en Firebase
        try {
            const user = await getCurrentUser();
            if (user) {
                await updateVisionMode(user.uid, modeId);
            }
        } catch (error) {
            console.error('Error updating vision mode in Firebase:', error);
        }

        // Anunciar cambio
        announce(`Modo ${mode.name} activado. ${mode.description}`);
    };

    // Toggle lector de pantalla (solo para LOW vision)
    const toggleScreenReader = async () => {
        if (!visionMode.screenReaderToggleable) {
            announce('El lector de pantalla no se puede desactivar en este modo.');
            return;
        }

        const newState = !screenReaderEnabled;
        setScreenReaderEnabled(newState);
        await AsyncStorage.setItem(STORAGE_KEYS.SCREEN_READER_ENABLED, String(newState));

        if (newState) {
            announce('Lector de pantalla activado');
        } else {
            speak('Lector de pantalla desactivado');
        }
    };

    // Anunciar texto (usa lector si está activo)
    const announce = (text, priority = 'polite') => {
        if (screenReaderEnabled || visionMode.screenReader) {
            speak(text);
        }
    };

    // Detener lectura
    const stopSpeaking = () => {
        stop();
    };

    // Obtener tema actual
    const theme = THEMES[visionMode.theme] || THEMES.normal;

    const value = {
        // Estado
        visionMode,
        screenReaderEnabled,
        isSystemScreenReaderEnabled,
        theme,

        // Acciones
        changeVisionMode,
        toggleScreenReader,
        announce,
        stopSpeaking,

        // Utilidades
        isScreenReaderActive: screenReaderEnabled || visionMode.screenReader || isSystemScreenReaderEnabled,
        canToggleScreenReader: visionMode.screenReaderToggleable,

        // Constantes
        VISION_MODES,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
};

export default AccessibilityContext;
