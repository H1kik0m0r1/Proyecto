import AsyncStorage from '@react-native-async-storage/async-storage';

// USER MANAGEMENT
export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user:', error);
    }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const clearUser = async () => {
    try {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('activeSession');
    } catch (error) {
        console.error('Error clearing user:', error);
    }
};

// SESSION MANAGEMENT
export const setActiveSession = async (isActive) => {
    try {
        await AsyncStorage.setItem('activeSession', isActive ? 'true' : 'false');
    } catch (error) {
        console.error('Error setting session:', error);
    }
};

export const getActiveSession = async () => {
    try {
        const session = await AsyncStorage.getItem('activeSession');
        return session === 'true';
    } catch (error) {
        console.error('Error getting session:', error);
        return false;
    }
};

// VISION MODE
export const saveVisionMode = async (mode) => {
    try {
        await AsyncStorage.setItem('visionMode', mode);
    } catch (error) {
        console.error('Error saving vision mode:', error);
    }
};

export const getVisionMode = async () => {
    try {
        return await AsyncStorage.getItem('visionMode') || 'normal';
    } catch (error) {
        console.error('Error getting vision mode:', error);
        return 'normal';
    }
};

// TRIP MANAGEMENT
export const saveTrip = async (trip) => {
    try {
        const trips = await getTrips();
        trips.unshift({
            ...trip,
            id: Date.now(),
            date: new Date().toISOString()
        });
        await AsyncStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
        console.error('Error saving trip:', error);
    }
};

export const getTrips = async () => {
    try {
        const trips = await AsyncStorage.getItem('trips');
        return trips ? JSON.parse(trips) : [];
    } catch (error) {
        console.error('Error getting trips:', error);
        return [];
    }
};
