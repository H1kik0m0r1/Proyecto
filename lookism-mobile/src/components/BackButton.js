import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function BackButton({ onPress, label = "Volver" }) {
    const { theme } = useAccessibility();

    return (
        <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.colors.primary }]}
            onPress={onPress}
            accessible={true}
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityHint="Toca para regresar a la pantalla anterior"
        >
            <Text style={[styles.arrow, { color: theme.colors.primary }]}>←</Text>
            <Text style={[styles.text, { color: theme.colors.primary, fontSize: theme.fontSizes.normal }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 56,
        alignSelf: 'flex-start',
    },
    arrow: {
        fontSize: 28,
        fontWeight: '700',
        marginRight: 8,
    },
    text: {
        fontWeight: '600',
    },
});
