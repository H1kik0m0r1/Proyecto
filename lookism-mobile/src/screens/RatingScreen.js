import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import BackButton from '../components/BackButton';

export default function RatingScreen({ navigation, route }) {
    const { destination } = route.params || { destination: { name: 'Viaje' } };
    const [rating, setRating] = useState(0);
    const { theme, announce } = useAccessibility();

    useEffect(() => {
        announce('Pantalla de calificación. ¿Qué tal estuvo tu viaje? Selecciona de 1 a 5 estrellas.');
    }, []);

    const handleRating = (stars) => {
        setRating(stars);
        announce(`${stars} estrellas seleccionadas`);
    };

    const submitRating = () => {
        if (rating === 0) {
            announce('Por favor selecciona una calificación');
            return;
        }

        announce(`Gracias por tu calificación de ${rating} estrellas. Volviendo al inicio.`);
        Alert.alert(
            '¡Gracias!',
            'Tu calificación ayuda a mejorar el servicio.',
            [
                {
                    text: 'Aceptar',
                    onPress: () => navigation.navigate('Home')
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                Califica tu viaje
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                Destino: {destination.name}
            </Text>

            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        style={styles.starButton}
                        onPress={() => handleRating(star)}
                        accessible={true}
                        accessibilityLabel={`${star} estrellas`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: rating >= star }}
                    >
                        <Text style={[styles.star, { color: rating >= star ? '#f59e0b' : theme.colors.border }]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.ratingTextContainer}>
                <Text style={[styles.ratingText, { color: theme.colors.primary, fontSize: theme.fontSizes.xlarge }]}>
                    {rating > 0 ? `${rating} / 5` : 'Selecciona una calificación'}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={submitRating}
                accessible={true}
                accessibilityLabel="Enviar calificación"
                accessibilityRole="button"
                disabled={rating === 0}
            >
                <Text style={[styles.submitButtonText, { fontSize: theme.fontSizes.large }]}>
                    Enviar Calificación
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.skipButton, { borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('Home')}
                accessible={true}
                accessibilityLabel="Saltar calificación"
                accessibilityRole="button"
            >
                <Text style={[styles.skipButtonText, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                    Saltar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 32,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 32,
        gap: 8,
    },
    starButton: {
        padding: 4,
    },
    star: {
        fontSize: 48,
    },
    ratingTextContainer: {
        marginBottom: 32,
        height: 40,
    },
    ratingText: {
        fontWeight: '700',
    },
    submitButton: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        minHeight: 56,
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    skipButton: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        minHeight: 56,
        justifyContent: 'center',
    },
    skipButtonText: {
        fontWeight: '600',
    },
});
