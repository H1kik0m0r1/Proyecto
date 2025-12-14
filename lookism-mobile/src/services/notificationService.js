import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermissions = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return { success: false, error: 'Permisos de notificaciones denegados' };
        }

        // Configurar canal para Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Programar notificación local
 */
export const scheduleNotification = async (title, body, seconds = 0) => {
    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: seconds > 0 ? { seconds } : null,
        });

        return { success: true, notificationId: id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Notificación: Conductor asignado
 */
export const notifyDriverAssigned = async (driverName, carModel) => {
    return await scheduleNotification(
        '🚗 Conductor Asignado',
        `${driverName} va en camino en un ${carModel}`,
        1
    );
};

/**
 * Notificación: Conductor cerca
 */
export const notifyDriverNear = async (eta) => {
    return await scheduleNotification(
        '⏱️ Conductor Cerca',
        `Tu conductor llegará en ${eta} minutos`,
        1
    );
};

/**
 * Notificación: Conductor llegó
 */
export const notifyDriverArrived = async (driverName) => {
    return await scheduleNotification(
        '✅ Conductor Llegó',
        `${driverName} te está esperando`,
        0
    );
};

/**
 * Notificación: Viaje iniciado
 */
export const notifyTripStarted = async (destination) => {
    return await scheduleNotification(
        '🗺️ Viaje Iniciado',
        `En camino a ${destination}`,
        0
    );
};

/**
 * Notificación: Viaje completado
 */
export const notifyTripCompleted = async () => {
    return await scheduleNotification(
        '🎉 Has Llegado',
        'Tu viaje ha sido completado',
        0
    );
};

/**
 * Cancelar notificación
 */
export const cancelNotification = async (notificationId) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Cancelar todas las notificaciones
 */
export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
