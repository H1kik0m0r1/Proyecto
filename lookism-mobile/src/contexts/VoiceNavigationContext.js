import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

/**
 * VoiceNavigationContext
 * 
 * Gestiona la navegación por voz usando expo-speech
 * Incluye cola de mensajes y control de reproducción
 */

const VoiceNavigationContext = createContext();

const STORAGE_KEY = '@lookism:voice_navigation_enabled';

// Prioridades de mensajes
const PRIORITY = {
    LOW: 0,
    NORMAL: 1,
    HIGH: 2,
    URGENT: 3,
};

export const VoiceNavigationProvider = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const messageQueueRef = useRef([]);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setIsEnabled(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading voice navigation settings:', error);
        }
    };

    const toggle = async () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

        if (newState) {
            speak('Navegación por voz activada', PRIORITY.HIGH);
        } else {
            Speech.stop();
            speak('Navegación por voz desactivada');
        }
    };

    /**
     * Anunciar mensaje con prioridad
     */
    const announce = (text, priority = PRIORITY.NORMAL) => {
        if (!isEnabled) return;

        const message = {
            text,
            priority,
            timestamp: Date.now(),
        };

        // Si es urgente, interrumpir y hablar inmediatamente
        if (priority === PRIORITY.URGENT) {
            Speech.stop();
            speakNow(text);
            return;
        }

        // Agregar a cola
        messageQueueRef.current.push(message);

        // Ordenar por prioridad
        messageQueueRef.current.sort((a, b) => b.priority - a.priority);

        // Si no está hablando, procesar cola
        if (!isSpeaking) {
            processQueue();
        }
    };

    const processQueue = () => {
        if (messageQueueRef.current.length === 0) {
            setIsSpeaking(false);
            setCurrentMessage(null);
            return;
        }

        const message = messageQueueRef.current.shift();
        speakNow(message.text);
    };

    const speakNow = (text) => {
        setIsSpeaking(true);
        setCurrentMessage(text);

        Speech.speak(text, {
            language: 'es-ES',
            pitch: 1.0,
            rate: 0.9, // Velocidad ligeramente más lenta para accesibilidad
            onDone: () => {
                setIsSpeaking(false);
                processQueue(); // Siguiente mensaje en cola
            },
            onStopped: () => {
                setIsSpeaking(false);
            },
            onError: (error) => {
                console.error('Speech error:', error);
                setIsSpeaking(false);
                processQueue();
            },
        });
    };

    const stopSpeaking = () => {
        Speech.stop();
        messageQueueRef.current = [];
        setIsSpeaking(false);
        setCurrentMessage(null);
    };

    const clearQueue = () => {
        messageQueueRef.current = [];
    };

    /**
     * Anuncios predefinidos para eventos comunes
     */
    const announcements = {
        // Navegación
        screenEntered: (screenName, instructions = '') => {
            announce(`Pantalla ${screenName}. ${instructions}`, PRIORITY.HIGH);
        },

        // Viajes
        tripRequested: () => {
            announce('Viaje solicitado. Buscando conductor disponible.', PRIORITY.HIGH);
        },

        driverAssigned: (driverName, carModel) => {
            announce(`Conductor asignado. ${driverName} va en camino en un ${carModel}.`, PRIORITY.HIGH);
        },

        driverArriving: (eta) => {
            announce(`Tu conductor llegará en ${eta} minutos.`, PRIORITY.NORMAL);
        },

        driverArrived: (driverName) => {
            announce(`${driverName} ha llegado. Por favor dirígete al vehículo.`, PRIORITY.URGENT);
        },

        tripStarted: (destination) => {
            announce(`Viaje iniciado. En camino a ${destination}.`, PRIORITY.HIGH);
        },

        tripCompleted: () => {
            announce('Has llegado a tu destino. Viaje completado.', PRIORITY.HIGH);
        },

        tripCancelled: () => {
            announce('Viaje cancelado exitosamente.', PRIORITY.HIGH);
        },

        // Acciones
        actionConfirmed: (action) => {
            announce(`${action} confirmado.`, PRIORITY.NORMAL);
        },

        actionCancelled: (action) => {
            announce(`${action} cancelado.`, PRIORITY.NORMAL);
        },

        // Errores
        error: (message) => {
            announce(`Error: ${message}`, PRIORITY.HIGH);
        },

        // Emergencia
        emergencyActivated: () => {
            announce('Botón de emergencia activado. Selecciona una opción.', PRIORITY.URGENT);
        },
    };

    const value = {
        isEnabled,
        isSpeaking,
        currentMessage,
        toggle,
        announce,
        stopSpeaking,
        clearQueue,
        announcements,
        speak: speakNow,
        PRIORITY,
    };

    return (
        <VoiceNavigationContext.Provider value={value}>
            {children}
        </VoiceNavigationContext.Provider>
    );
};

export const useVoiceNavigation = () => {
    const context = useContext(VoiceNavigationContext);
    if (!context) {
        throw new Error('useVoiceNavigation must be used within VoiceNavigationProvider');
    }
    return context;
};

export default VoiceNavigationContext;
