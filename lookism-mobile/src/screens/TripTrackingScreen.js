import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Alert,
    TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAccessibility } from '../contexts/AccessibilityContext';
import useGestureDetection from '../hooks/useGestureDetection';
import EmergencyButton from '../components/EmergencyButton';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Conductores simulados
const DRIVERS = [
    { id: 1, name: 'Carlos Mendoza', car: 'Toyota Corolla', plate: 'ABC-123', rating: 4.8, color: 'Gris' },
    { id: 2, name: 'María González', car: 'Honda Civic', plate: 'XYZ-789', rating: 4.9, color: 'Azul' },
    { id: 3, name: 'Pedro Ramírez', car: 'Mazda 3', plate: 'DEF-456', rating: 4.7, color: 'Rojo' },
    { id: 4, name: 'Ana López', car: 'Nissan Sentra', plate: 'GHI-012', rating: 5.0, color: 'Blanco' },
];

// Estados del viaje
const TRIP_STATES = {
    SEARCHING: 'searching',
    ASSIGNED: 'assigned',
    ARRIVING: 'arriving',
    ARRIVED: 'arrived',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

export default function TripTrackingScreen({ route, navigation }) {
    const { destination, userLocation } = route.params;
    const { theme, announce, visionMode } = useAccessibility();

    const [tripState, setTripState] = useState(TRIP_STATES.SEARCHING);
    const [driver, setDriver] = useState(null);
    const [eta, setEta] = useState(5);
    const [driverLocation, setDriverLocation] = useState(null);

    const cancelTrip = () => {
        Alert.alert(
            'Cancelar Viaje',
            '¿Estás seguro que deseas cancelar el viaje?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: () => {
                        navigation.goBack();
                        announce('Viaje cancelado.');
                    },
                },
            ]
        );
    };

    // Gestos
    const { handleTap, getLongPressProps } = useGestureDetection({
        onShake: () => {
            announce('Emergencia detectada. Abriendo opciones de ayuda.');
            // El botón EmergencyButton se encarga del modal
        },
        onDoubleTap: () => {
            if (tripState !== TRIP_STATES.COMPLETED) {
                announce('Doble toque detectado. Cancelando viaje.');
                cancelTrip();
            }
        },
        enableShake: true,
        enableDoubleTap: true,
    });

    const progressAnim = new Animated.Value(0);

    useEffect(() => {
        simulateTripFlow();
        // Anuncio de instrucciones para modo ceguera
        if (visionMode.id === 'blind') {
            setTimeout(() => {
                announce('Pantalla de seguimiento. Comandos disponibles: Sacude el celular para emergencia. Doble toque en la pantalla para cancelar viaje. Mantén presionado para opciones.');
            }, 4000); // Wait for initial announcement
        }
    }, []);

    const simulateTripFlow = async () => {
        // 1. Buscando conductor
        announce('Buscando conductor disponible');
        await wait(3000);

        // 2. Conductor asignado
        const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
        setDriver(randomDriver);
        setTripState(TRIP_STATES.ASSIGNED);
        announce(`Conductor encontrado. ${randomDriver.name} va en camino en un ${randomDriver.car} ${randomDriver.color}.`);

        // Ubicación inicial del conductor
        const driverStartLocation = {
            latitude: userLocation.latitude + 0.005,
            longitude: userLocation.longitude + 0.005,
        };
        setDriverLocation(driverStartLocation);

        await wait(2000);

        // 3. Acercándose
        setTripState(TRIP_STATES.ARRIVING);
        announce(`Tu conductor está a ${eta} minutos.`);

        // Simular acercamiento
        animateDriverApproach(driverStartLocation, userLocation);

        const countdown = setInterval(() => {
            setEta(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 12000); // 1 minuto real = 12 seg simulados

        await wait(15000 * 5); // Esperar simulación

        if (tripState !== TRIP_STATES.COMPLETED) {
            // 4. Llegó
            setTripState(TRIP_STATES.ARRIVED);
            setDriverLocation(userLocation);

            // Sonido de llegada simulado (Vibración fuerte + Voz distintiva)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            announce(`¡Ding ding! Tu conductor ${randomDriver.name} ha llegado. Auto ${randomDriver.car} color ${randomDriver.color}, placas ${randomDriver.plate}.`);
        }
    };

    const animateDriverApproach = (start, end) => {
        // Simulación básica
    };

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getStateText = () => {
        switch (tripState) {
            case TRIP_STATES.SEARCHING:
                return 'Buscando conductor...';
            case TRIP_STATES.ASSIGNED:
                return 'Conductor asignado';
            case TRIP_STATES.ARRIVING:
                return `Conductor en camino • ${eta} min`;
            case TRIP_STATES.ARRIVED:
                return '¡El conductor ha llegado!';
            case TRIP_STATES.IN_PROGRESS:
                return 'En viaje...';
            case TRIP_STATES.COMPLETED:
                return '¡Has llegado!';
            default:
                return '';
        }
    };

    const getStateIcon = () => {
        return '🚗';
    };

    const startTrip = () => {
        setTripState(TRIP_STATES.IN_PROGRESS);
        announce('Viaje iniciado. En camino a tu destino.');

        // Simular fin del viaje
        setTimeout(() => {
            setTripState(TRIP_STATES.COMPLETED);
            announce('Has llegado a tu destino.');
            navigation.replace('Payment', { destination });
        }, 5000);
    };

    return (
        <TouchableWithoutFeedback
            onPress={handleTap}
            {...getLongPressProps(() => {
                announce('Opciones. Cancelar viaje seleccionado.');
                cancelTrip();
            })}
            accessible={true}
            accessibilityLabel="Pantalla de viaje. Toca dos veces para cancelar. Sacude para emergencia."
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Map */}
                {userLocation && (
                    <View style={{ width: width, height: height * 0.6 }} pointerEvents={visionMode.id === 'blind' ? "none" : "auto"}>
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            region={{
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                            showsUserLocation={true}
                        >
                            <Marker coordinate={userLocation} title="Tu ubicación" pinColor="blue" />
                            <Marker coordinate={{ latitude: userLocation.latitude + 0.01, longitude: userLocation.longitude + 0.01 }} title={destination.name} pinColor="red" />
                            {driverLocation && (
                                <Marker coordinate={driverLocation} title={driver?.name}>
                                    <View style={styles.carMarker}>
                                        <Text style={styles.carIcon}>🚗</Text>
                                    </View>
                                </Marker>
                            )}
                        </MapView>
                    </View>
                )}

                {/* Trip Info Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.background, flex: 1 }]}>
                    <View style={styles.stateContainer}>
                        <Text style={[styles.stateText, { color: theme.colors.primary, fontSize: theme.fontSizes.xlarge }]}>
                            {getStateText()}
                        </Text>
                    </View>

                    {driver && tripState !== TRIP_STATES.SEARCHING && (
                        <View style={[styles.driverCard, { backgroundColor: theme.colors.cardBg }]}>
                            <View style={styles.driverInfo}>
                                <View style={[styles.driverAvatar, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
                                </View>
                                <View style={styles.driverDetails}>
                                    <Text style={[styles.driverName, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                                        {driver.name}
                                    </Text>
                                    <Text style={[styles.driverCar, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                                        {driver.car} {driver.color} • {driver.plate}
                                    </Text>
                                    <Text style={[styles.driverRating, { fontSize: theme.fontSizes.small }]}>
                                        ⭐ {driver.rating}
                                    </Text>
                                </View>
                            </View>

                            {tripState === TRIP_STATES.ARRIVED && (
                                <TouchableOpacity
                                    style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={startTrip}
                                    accessible={true}
                                    accessibilityLabel="Iniciar viaje"
                                    accessibilityRole="button"
                                >
                                    <Text style={[styles.buttonText, { fontSize: theme.fontSizes.large }]}>
                                        Iniciar Viaje
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {tripState !== TRIP_STATES.COMPLETED && tripState !== TRIP_STATES.IN_PROGRESS && (
                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: theme.colors.border, marginTop: 10 }]}
                            onPress={cancelTrip}
                            accessible={true}
                            accessibilityLabel="Cancelar viaje"
                        >
                            <Text style={[styles.cancelText, { color: theme.colors.primary, fontSize: theme.fontSizes.normal }]}>
                                Cancelar Viaje
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.destinationInfo}>
                        <Text style={[styles.destinationLabel, { color: theme.colors.textLight, fontSize: theme.fontSizes.small, marginTop: 16 }]}>
                            Destino:
                        </Text>
                        <Text style={[styles.destinationName, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                            {destination.name}
                        </Text>
                    </View>
                </View>

                <EmergencyButton visible={true} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height * 0.6,
    },
    card: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        marginTop: -24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    stateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stateIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    stateText: {
        fontWeight: '700',
    },
    driverCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    driverAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    driverDetails: {
        flex: 1,
    },
    driverName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    driverCar: {
        marginBottom: 4,
    },
    driverRating: {
        color: '#f59e0b',
    },
    startButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 56,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
    destinationInfo: {
        marginBottom: 16,
    },
    destinationLabel: {
        marginBottom: 4,
    },
    destinationName: {
        fontWeight: '600',
    },
    cancelButton: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        minHeight: 56,
    },
    cancelText: {
        fontWeight: '600',
    },
    carMarker: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    carIcon: {
        fontSize: 24,
    },
});
