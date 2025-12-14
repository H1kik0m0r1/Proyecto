import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#667eea',
    background: '#ffffff',
    text: '#2d3748',
    textLight: '#718096',
    border: '#e2e8f0',
    cardBg: '#f7fafc',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 56,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        borderRadius: 12,
        fontSize: 18,
        minHeight: 56,
        backgroundColor: '#fff',
    },
});
