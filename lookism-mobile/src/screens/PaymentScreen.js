import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getCurrentUser, saveTrip } from '../services/firebaseService';
import { useAccessibility } from '../contexts/AccessibilityContext';
import BackButton from '../components/BackButton';

const PAYMENT_METHODS = [
    { id: 1, type: 'Efectivo', icon: '💵' },
    { id: 2, type: 'Tarjeta ****1234', icon: '💳' },
    { id: 3, type: 'Tarjeta ****5678', icon: '💳' },
];

export default function PaymentScreen({ route, navigation }) {
    const { destination } = route.params;
    const [selected, setSelected] = useState(1);
    const { theme, announce } = useAccessibility();

    useEffect(() => {
        announce(`Pago. Destino: ${destination.name}. Total: ${destination.price} pesos. Selecciona método de pago.`);
    }, []);

    const confirmTrip = async () => {
        const method = PAYMENT_METHODS.find(m => m.id === selected);
        announce(`Viaje confirmado. Pago con ${method.type}. Guardando en base de datos.`);

        try {
            const user = await getCurrentUser();
            if (user) {
                await saveTrip(user.uid, {
                    destination: destination.name,
                    address: destination.address,
                    price: destination.price,
                    payment: method.type,
                    status: 'completed',
                });
            }
        } catch (error) {
            console.error('Error saving trip:', error);
        }

        Alert.alert(
            'Viaje Confirmado',
            'Tu viaje ha sido guardado en el historial',
            [
                { text: 'Ver Historial', onPress: () => navigation.navigate('History') },
                { text: 'Calificar Viaje', onPress: () => navigation.navigate('Rating', { destination }) },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackButton onPress={() => navigation.goBack()} />

            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                Confirmar Viaje
            </Text>

            <View
                style={[styles.tripCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                accessible={true}
                accessibilityLabel={`Destino: ${destination.name}, ${destination.address}, Total: ${destination.price} pesos`}
            >
                <Text style={[styles.destName, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                    {destination.name}
                </Text>
                <Text style={[styles.destAddress, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                    {destination.address}
                </Text>
                <Text style={[styles.price, { color: theme.colors.primary, fontSize: theme.fontSizes.xlarge }]}>
                    Total: ${destination.price}
                </Text>
            </View>

            <Text style={[styles.subtitle, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                Método de Pago:
            </Text>

            {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                    key={method.id}
                    style={[
                        styles.methodCard,
                        { borderColor: theme.colors.border, backgroundColor: theme.colors.cardBg },
                        selected === method.id && { borderColor: theme.colors.primary, backgroundColor: theme.colors.cardBg }
                    ]}
                    onPress={() => {
                        setSelected(method.id);
                        announce(`Seleccionado: ${method.type}`);
                    }}
                    accessible={true}
                    accessibilityLabel={`${method.type}${selected === method.id ? ', seleccionado' : ''}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected === method.id }}
                >
                    <Text style={styles.methodIcon}>{method.icon}</Text>
                    <Text style={[styles.methodText, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                        {method.type}
                    </Text>
                    {selected === method.id && (
                        <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                    )}
                </TouchableOpacity>
            ))}

            <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: theme.colors.primary }]}
                onPress={confirmTrip}
                accessible={true}
                accessibilityLabel="Confirmar viaje"
                accessibilityRole="button"
            >
                <Text style={[styles.confirmButtonText, { fontSize: theme.fontSizes.large }]}>
                    Confirmar Viaje
                </Text>
            </TouchableOpacity>
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
    tripCard: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
    },
    destName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    destAddress: {
        marginBottom: 12,
    },
    price: {
        fontWeight: '700',
    },
    subtitle: {
        fontWeight: '600',
        marginBottom: 16,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 12,
        minHeight: 64,
    },
    methodIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    methodText: {
        flex: 1,
    },
    checkmark: {
        fontSize: 24,
        fontWeight: '700',
    },
    confirmButton: {
        marginTop: 32,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
