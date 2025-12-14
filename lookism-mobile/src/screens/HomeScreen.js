import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
    Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getCurrentUser, logoutUser, updateVisionMode } from '../services/firebaseService';
import { requestNotificationPermissions } from '../services/notificationService';
import { useAccessibility } from '../contexts/AccessibilityContext';
import Sidebar from '../components/Sidebar';
import EmergencyButton from '../components/EmergencyButton';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('Buscando ubicación...');
    const [errorMsg, setErrorMsg] = useState(null);

    const { theme, visionMode, changeVisionMode, announce } = useAccessibility();

    useEffect(() => {
        loadUser();
        requestLocationPermission();
        // Notificaciones funcionan pero Expo Go muestra warning
        // Descomentar para build de producción
        // requestNotificationPermissions();
    }, []);

    const toggleTheme = async () => {
        // Cambiar entre normal y alto contraste
        const nextMode = visionMode.id === 'good' ? 'low' : 'good';
        await changeVisionMode(nextMode);
    };

    const loadUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestLocationPermission = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                announce('Permiso de ubicación denegado');
                return;
            }

            await getCurrentLocation();
        } catch (error) {
            console.error('Error requesting permission:', error);
            setErrorMsg('Error al obtener permiso');
        }
    };

    const getCurrentLocation = async () => {
        try {
            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Geocodificación inversa
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const addr = reverseGeocode[0];
                const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || addr.district || ''}`.trim();
                setAddress(formattedAddress || 'Ubicación encontrada');
                announce(`Pantalla principal. Ubicación actual: ${formattedAddress}. ¿A dónde quieres ir, ${user?.nombre || 'usuario'}?`);
            }
        } catch (error) {
            console.error('Error getting location:', error);
            setErrorMsg('No se pudo obtener ubicación');
            setAddress('Av. Principal 123, Ciudad (simulado)');
        }
    };

    const goToSearch = () => {
        announce('Búsqueda de destino');
        navigation.navigate('SearchDestination', { userLocation: location });
    };

    const goToHistory = () => {
        announce('Historial de viajes');
        navigation.navigate('History');
    };

    const handleShortcut = (place) => {
        announce(`Acceso rápido a ${place}`);
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión? Tus viajes se mantendrán guardados en Firebase.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: () => announce('Cancelado'),
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await logoutUser();
                        if (result.success) {
                            announce('Sesión cerrada');
                            navigation.replace('Login');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>Cargando...</Text>
            </View>
        );
    }

    return (
        <>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                            setIsSidebarOpen(true);
                            announce('Menú abierto');
                        }}
                        accessible={true}
                        accessibilityLabel="Abrir menú"
                        accessibilityRole="button"
                    >
                        <Text style={[styles.menuIcon, { color: theme.colors.primary }]}>☰</Text>
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: theme.colors.primary, fontSize: theme.fontSizes.large }]}>LOOKISM</Text>

                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[styles.themeButton, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                            onPress={toggleTheme}
                            accessible={true}
                            accessibilityLabel={`Cambiar contraste, actualmente ${visionMode.name}`}
                            accessibilityRole="button"
                        >
                            <Text style={styles.themeIcon}>{visionMode.id === 'low' ? '🌙' : '☀️'}</Text>
                        </TouchableOpacity>

                        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.avatarText}>
                                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[styles.greeting, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                        Hola, {user?.nombre || 'Usuario'} 👋
                    </Text>

                    {/* Map View */}
                    {location ? (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                provider={PROVIDER_GOOGLE}
                                region={location}
                                showsUserLocation={true}
                                showsMyLocationButton={true}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                    }}
                                    title="Tu ubicación"
                                    description={address}
                                />
                            </MapView>

                            <View
                                style={[styles.locationOverlay, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                                accessible={true}
                                accessibilityLabel={`Tu ubicación actual: ${address}`}
                            >
                                <Text style={[styles.locationLabel, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                                    Tu ubicación:
                                </Text>
                                <Text style={[styles.locationText, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                                    {address}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.locationCard, { backgroundColor: theme.colors.cardBg }]}>
                            <Text style={[styles.locationLabel, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                                {errorMsg || 'Obteniendo ubicación...'}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.searchBox, { backgroundColor: '#fff', borderColor: theme.colors.border }]}
                        onPress={goToSearch}
                        accessible={true}
                        accessibilityLabel="Buscar destino"
                        accessibilityRole="button"
                        accessibilityHint="Abre la pantalla de búsqueda de destinos"
                    >
                        <Text style={styles.searchIcon}>🔍</Text>
                        <Text style={[styles.searchText, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                            Buscar destino...
                        </Text>
                    </TouchableOpacity>

                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                        Accesos Rápidos
                    </Text>
                    <View style={styles.shortcuts}>
                        <TouchableOpacity
                            style={[styles.shortcut, { backgroundColor: theme.colors.cardBg }]}
                            onPress={() => handleShortcut('Casa')}
                            accessible={true}
                            accessibilityLabel="Ir a casa"
                            accessibilityRole="button"
                        >
                            <Text style={styles.shortcutIcon}>🏠</Text>
                            <Text style={[styles.shortcutLabel, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                                Casa
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.shortcut, { backgroundColor: theme.colors.cardBg }]}
                            onPress={() => handleShortcut('Trabajo')}
                            accessible={true}
                            accessibilityLabel="Ir al trabajo"
                            accessibilityRole="button"
                        >
                            <Text style={styles.shortcutIcon}>💼</Text>
                            <Text style={[styles.shortcutLabel, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                                Trabajo
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 24, marginBottom: 32 }]}
                        onPress={goToHistory}
                        accessible={true}
                        accessibilityLabel="Ver historial de viajes"
                        accessibilityRole="button"
                    >
                        <Text style={[styles.buttonText, { fontSize: theme.fontSizes.large }]}>Ver Historial</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <EmergencyButton visible={true} />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navigation={navigation}
                userName={user?.nombre}
                onLogout={handleLogout}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    menuButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 28,
    },
    title: {
        fontWeight: '700',
    },
    avatarContainer: {
        width: 48,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    greeting: {
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 24,
    },
    mapContainer: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    locationOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    locationCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    locationLabel: {
        fontSize: 14,
    },
    locationText: {
        fontWeight: '600',
        marginTop: 4,
    },
    searchBox: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    searchText: {
        fontSize: 18,
    },
    sectionTitle: {
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
    },
    shortcuts: {
        flexDirection: 'row',
        gap: 16,
    },
    shortcut: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
    },
    shortcutIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    shortcutLabel: {
        fontWeight: '600',
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 56,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
    loadingText: {
        marginTop: 16,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    themeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    themeIcon: {
        fontSize: 24,
    },
});
