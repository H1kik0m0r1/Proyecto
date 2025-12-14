import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@lookism:saved_addresses';

/**
 * Estructura de dirección:
 * {
 *   id: string (uuid),
 *   type: 'home' | 'work' | 'custom',
 *   name: string,
 *   address: string,
 *   coordinates: { latitude: number, longitude: number },
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 */

// Generar ID único
const generateId = () => {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Obtener todas las direcciones guardadas
 */
export const getAddresses = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting addresses:', error);
        return [];
    }
};

/**
 * Guardar nueva dirección
 */
export const saveAddress = async (addressData) => {
    try {
        const addresses = await getAddresses();

        const newAddress = {
            id: generateId(),
            type: addressData.type || 'custom',
            name: addressData.name,
            address: addressData.address,
            coordinates: addressData.coordinates || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addresses.push(newAddress);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));

        return { success: true, address: newAddress };
    } catch (error) {
        console.error('Error saving address:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Actualizar dirección existente
 */
export const updateAddress = async (id, updates) => {
    try {
        const addresses = await getAddresses();
        const index = addresses.findIndex(addr => addr.id === id);

        if (index === -1) {
            return { success: false, error: 'Dirección no encontrada' };
        }

        addresses[index] = {
            ...addresses[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));

        return { success: true, address: addresses[index] };
    } catch (error) {
        console.error('Error updating address:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Eliminar dirección
 */
export const deleteAddress = async (id) => {
    try {
        const addresses = await getAddresses();
        const filtered = addresses.filter(addr => addr.id !== id);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

        return { success: true };
    } catch (error) {
        console.error('Error deleting address:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Obtener dirección por tipo (home, work)
 */
export const getAddressByType = async (type) => {
    try {
        const addresses = await getAddresses();
        return addresses.find(addr => addr.type === type) || null;
    } catch (error) {
        console.error('Error getting address by type:', error);
        return null;
    }
};

/**
 * Verificar si existe dirección de un tipo
 */
export const hasAddressOfType = async (type) => {
    const address = await getAddressByType(type);
    return address !== null;
};
