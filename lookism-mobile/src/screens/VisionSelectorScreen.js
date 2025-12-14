import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useVoiceNavigation } from '../contexts/VoiceNavigationContext';

export default function VisionSelectorScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const { changeVisionMode, VISION_MODES, theme } = useAccessibility();
    const { announcements } = useVoiceNavigation();

    useEffect(() => {
        announcements.screenEntered(
            'Configuración de accesibilidad',
            'Selecciona el modo que mejor se adapte a tu visión'
        );
    }, []);

    const selectMode = async (modeId, modeName) => {
        setLoading(true);

        try {
            await changeVisionMode(modeId);
            announcements.actionConfirmed(`Modo ${modeName} activado`);

            // Navegar a Home después de seleccionar
            setTimeout(() => {
                navigation.replace('Home');
            }, 500);
        } catch (error) {
            console.error('Error selecting vision mode:', error);
            announcements.error('No se pudo cambiar el modo de visión');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>
                    Configurando modo...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                ¿Cómo ves?
            </Text>
            <Text style={[styles.description, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                Selecciona la opción que mejor describa tu visión
            </Text>

            {/* Modo: Buena visión */}
            <TouchableOpacity
                style={[styles.option, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                onPress={() => selectMode(VISION_MODES.GOOD.id, VISION_MODES.GOOD.name)}
                accessible={true}
                accessibilityLabel={`${VISION_MODES.GOOD.name}. ${VISION_MODES.GOOD.description}`}
                accessibilityRole="button"
                accessibilityHint="Toca para seleccionar este modo"
            >
                <Text style={styles.optionIcon}>👁️</Text>
                <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                        {VISION_MODES.GOOD.name}
                    </Text>
                    <Text style={[styles.optionDesc, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                        {VISION_MODES.GOOD.description}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Modo: Baja visión */}
            <TouchableOpacity
                style={[styles.option, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                onPress={() => selectMode(VISION_MODES.LOW.id, VISION_MODES.LOW.name)}
                accessible={true}
                accessibilityLabel={`${VISION_MODES.LOW.name}. ${VISION_MODES.LOW.description}`}
                accessibilityRole="button"
                accessibilityHint="Toca para seleccionar este modo con lector opcional"
            >
                <Text style={styles.optionIcon}>🔍</Text>
                <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                        {VISION_MODES.LOW.name}
                    </Text>
                    <Text style={[styles.optionDesc, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                        {VISION_MODES.LOW.description}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Modo: Ceguera */}
            <TouchableOpacity
                style={[styles.option, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                onPress={() => selectMode(VISION_MODES.BLIND.id, VISION_MODES.BLIND.name)}
                accessible={true}
                accessibilityLabel={`${VISION_MODES.BLIND.name}. ${VISION_MODES.BLIND.description}`}
                accessibilityRole="button"
                accessibilityHint="Toca para seleccionar modo con lector de pantalla obligatorio"
            >
                <Text style={styles.optionIcon}>🔊</Text>
                <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                        {VISION_MODES.BLIND.name}
                    </Text>
                    <Text style={[styles.optionDesc, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                        {VISION_MODES.BLIND.description}
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={[styles.infoText, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                    💡 Puedes cambiar el modo en cualquier momento desde el menú de configuración
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginBottom: 32,
    },
    option: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 2,
        minHeight: 110,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIcon: {
        fontSize: 40,
        marginRight: 20,
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontWeight: '600',
        marginBottom: 6,
    },
    optionDesc: {
        lineHeight: 20,
    },
    infoBox: {
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        opacity: 0.8,
    },
    infoText: {
        textAlign: 'center',
        lineHeight: 20,
    },
    loadingText: {
        marginTop: 16,
    },
});
