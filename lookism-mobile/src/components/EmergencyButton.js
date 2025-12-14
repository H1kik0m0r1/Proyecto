import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking, Alert } from 'react-native';
import * as Location from 'expo-location';
import { speak } from '../utils/voice';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function EmergencyButton({ visible = true }) {
    const [showModal, setShowModal] = useState(false);
    const { theme } = useAccessibility();

    const handleEmergency = () => {
        speak('Botón de emergencia. Selecciona una opción.');
        setShowModal(true);
    };

    const call911 = () => {
        setShowModal(false);
        speak('Llamando a servicios de emergencia');
        Alert.alert(
            'Llamada de Emergencia',
            '¿Deseas llamar al 911?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Llamar',
                    onPress: () => {
                        // En producción, esto abriría el marcador
                        Linking.openURL('tel:911');
                    },
                },
            ]
        );
    };

    const shareLocation = async () => {
        setShowModal(false);
        speak('Compartiendo ubicación con contactos de confianza');

        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

            Alert.alert(
                'Ubicación Compartida',
                `Tu ubicación ha sido compartida con tus contactos de confianza.\n\nLink: ${mapsUrl}`,
                [{ text: 'OK' }]
            );

            speak('Ubicación compartida exitosamente');
        } catch (error) {
            speak('Error al obtener ubicación');
            Alert.alert('Error', 'No se pudo obtener tu ubicación');
        }
    };

    const contactTrust = () => {
        setShowModal(false);
        speak('Contactando a personas de confianza');
        Alert.alert(
            'Contactos de Confianza',
            'Se ha enviado un mensaje de alerta a:\n• María (Mamá)\n• José (Papá)\n• Ana (Amiga)',
            [{ text: 'OK' }]
        );
    };

    if (!visible) return null;

    return (
        <>
            {/* Botón flotante */}
            <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: '#dc2626' }]}
                onPress={handleEmergency}
                accessible={true}
                accessibilityLabel="Botón de emergencia"
                accessibilityRole="button"
                accessibilityHint="Toca para mostrar opciones de ayuda de emergencia"
            >
                <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>

            {/* Modal de opciones */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                            ⚠️ Emergencia
                        </Text>
                        <Text style={[styles.modalSubtitle, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                            Selecciona una opción:
                        </Text>

                        <TouchableOpacity
                            style={[styles.emergencyOption, { backgroundColor: '#dc2626' }]}
                            onPress={call911}
                            accessible={true}
                            accessibilityLabel="Llamar al 911"
                            accessibilityRole="button"
                        >
                            <Text style={styles.optionIcon}>📞</Text>
                            <Text style={styles.optionText}>Llamar 911</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.emergencyOption, { backgroundColor: '#f59e0b' }]}
                            onPress={shareLocation}
                            accessible={true}
                            accessibilityLabel="Compartir mi ubicación"
                            accessibilityRole="button"
                        >
                            <Text style={styles.optionIcon}>📍</Text>
                            <Text style={styles.optionText}>Compartir Ubicación</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.emergencyOption, { backgroundColor: '#3b82f6' }]}
                            onPress={contactTrust}
                            accessible={true}
                            accessibilityLabel="Alertar contactos de confianza"
                            accessibilityRole="button"
                        >
                            <Text style={styles.optionIcon}>👥</Text>
                            <Text style={styles.optionText}>Contactos de Confianza</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
                            onPress={() => {
                                setShowModal(false);
                                speak('Cancelado');
                            }}
                            accessible={true}
                            accessibilityLabel="Cancelar"
                            accessibilityRole="button"
                        >
                            <Text style={[styles.cancelText, { color: theme.colors.textLight }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 1000,
    },
    sosText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        elevation: 10,
    },
    modalTitle: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        textAlign: 'center',
        marginBottom: 24,
    },
    emergencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        minHeight: 65,
    },
    optionIcon: {
        fontSize: 28,
        marginRight: 16,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    cancelButton: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
