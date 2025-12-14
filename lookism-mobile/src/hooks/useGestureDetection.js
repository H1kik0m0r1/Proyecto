import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

/**
 * Hook para detectar gestos del dispositivo
 * 
 * Gestos implementados:
 * - Shake (sacudir): Emergencia
 * - Long Press: Mantener presionado
 * - Double Tap: Doble toque rápido
 */

const SHAKE_THRESHOLD = 2.5; // Aceleración en g
const DOUBLE_TAP_DELAY = 300; // milisegundos
const LONG_PRESS_DURATION = 1000; // milisegundos

export const useGestureDetection = (options = {}) => {
    const {
        onShake,
        onDoubleTap,
        enableShake = true,
        enableDoubleTap = true,
    } = options;

    const [isShakeDetectionActive, setIsShakeDetectionActive] = useState(enableShake);
    const lastTapRef = useRef(null);
    const longPressTimerRef = useRef(null);

    // Detector de sacudida (shake)
    useEffect(() => {
        if (!isShakeDetectionActive || !onShake) return;

        let subscription;

        const startShakeDetection = async () => {
            try {
                // Configurar actualización del acelerómetro
                Accelerometer.setUpdateInterval(100);

                subscription = Accelerometer.addListener(({ x, y, z }) => {
                    // Calcular magnitud de aceleración
                    const acceleration = Math.sqrt(x * x + y * y + z * z);

                    // Detectar sacudida
                    if (acceleration > SHAKE_THRESHOLD) {
                        handleShake();
                    }
                });
            } catch (error) {
                console.error('Error starting shake detection:', error);
            }
        };

        startShakeDetection();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [isShakeDetectionActive, onShake]);

    const handleShake = async () => {
        // Vibración de feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        if (onShake) {
            onShake();
        }
    };

    // Handler para doble toque
    const handleTap = () => {
        if (!enableDoubleTap || !onDoubleTap) return;

        const now = Date.now();

        if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            // Doble toque detectado
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDoubleTap();
            lastTapRef.current = null;
        } else {
            // Primer toque
            lastTapRef.current = now;
        }
    };

    // Handlers para long press
    const handlePressIn = (callback) => {
        longPressTimerRef.current = setTimeout(async () => {
            // Vibración de feedback
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            if (callback) {
                callback();
            }
        }, LONG_PRESS_DURATION);
    };

    const handlePressOut = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    // Función para crear props de long press
    const getLongPressProps = (callback) => ({
        onPressIn: () => handlePressIn(callback),
        onPressOut: handlePressOut,
        delayLongPress: LONG_PRESS_DURATION,
    });

    return {
        // Shake
        isShakeDetectionActive,
        setIsShakeDetectionActive,

        // Double tap
        handleTap,

        // Long press
        getLongPressProps,

        // Haptics utilities
        vibrate: Haptics.impactAsync,
        notificationVibrate: Haptics.notificationAsync,
    };
};

export default useGestureDetection;
