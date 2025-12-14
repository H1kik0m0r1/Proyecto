import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getCurrentUser, getUserTrips } from '../services/firebaseService';
import { useAccessibility } from '../contexts/AccessibilityContext';
import BackButton from '../components/BackButton';

export default function HistoryScreen({ navigation }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme, announce } = useAccessibility();

    useEffect(() => {
        loadTrips();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTrips();
        });
        return unsubscribe;
    }, [navigation]);

    const loadTrips = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                const userTrips = await getUserTrips(user.uid);
                setTrips(userTrips);

                if (userTrips.length === 0) {
                    announce('Historial vacío. No hay viajes guardados.');
                } else {
                    announce(`Historial de viajes. ${userTrips.length} viajes encontrados.`);
                }
            }
        } catch (error) {
            console.error('Error loading trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                    Cargando historial...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackButton onPress={() => navigation.goBack()} />

            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                Historial de Viajes
            </Text>

            {trips.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={[styles.emptyText, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                        No hay viajes aún
                    </Text>
                    <Text style={[styles.emptyHint, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                        Los viajes que confirmes aparecerán aquí
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[styles.tripCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                            accessible={true}
                            accessibilityLabel={`Viaje a ${item.destination}, ${item.price} pesos, ${formatDate(item.date)}, pago con ${item.payment}`}
                        >
                            <Text style={[styles.tripDest, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                                {item.destination}
                            </Text>
                            <Text style={[styles.tripAddress, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                                {item.address}
                            </Text>
                            <View style={styles.tripFooter}>
                                <Text style={[styles.tripPrice, { color: theme.colors.primary, fontSize: theme.fontSizes.xlarge }]}>
                                    ${item.price}
                                </Text>
                                <Text style={[styles.tripDate, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                                    {formatDate(item.date)}
                                </Text>
                            </View>
                            <Text style={[styles.tripPayment, { color: theme.colors.text, fontSize: theme.fontSizes.small }]}>
                                💳 {item.payment}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontWeight: '700',
        marginBottom: 24,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyHint: {
        textAlign: 'center',
    },
    tripCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    tripDest: {
        fontWeight: '600',
        marginBottom: 4,
    },
    tripAddress: {
        marginBottom: 12,
    },
    tripFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    tripPrice: {
        fontWeight: '700',
    },
    tripDate: {
    },
    tripPayment: {
    },
    loadingText: {
        marginTop: 16,
    },
});
