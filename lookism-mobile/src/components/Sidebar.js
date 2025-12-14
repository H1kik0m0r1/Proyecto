import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { colors } from '../styles/global';

export default function Sidebar({ isOpen, onClose, navigation, userName, onLogout }) {
    const handleNavigation = (screen, label) => {
        onClose();
        navigation.navigate(screen);
    };

    const handleLogoutClick = () => {
        onClose();
        // Llamar al handler de logout del Home
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.sidebar} onStartShouldSetResponder={() => true}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                        <Text style={styles.userName}>{userName || 'Usuario'}</Text>
                    </View>

                    <ScrollView style={styles.menu}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleNavigation('Home', 'Inicio')}
                            accessible={true}
                            accessibilityLabel="Ir a inicio"
                            accessibilityRole="button"
                        >
                            <Text style={styles.menuIcon}>🏠</Text>
                            <Text style={styles.menuText}>Inicio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleNavigation('History', 'Historial')}
                            accessible={true}
                            accessibilityLabel="Ver historial de viajes"
                            accessibilityRole="button"
                        >
                            <Text style={styles.menuIcon}>📋</Text>
                            <Text style={styles.menuText}>Historial</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleNavigation('VisionSelector', 'Configuración')}
                            accessible={true}
                            accessibilityLabel="Configuración de accesibilidad"
                            accessibilityRole="button"
                        >
                            <Text style={styles.menuIcon}>⚙️</Text>
                            <Text style={styles.menuText}>Configuración</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={[styles.menuItem, styles.logoutItem]}
                            onPress={handleLogoutClick}
                            accessible={true}
                            accessibilityLabel="Cerrar sesión"
                            accessibilityRole="button"
                        >
                            <Text style={styles.menuIcon}>🚪</Text>
                            <Text style={[styles.menuText, styles.logoutText]}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        accessible={true}
                        accessibilityLabel="Cerrar menú"
                        accessibilityRole="button"
                    >
                        <Text style={styles.closeText}>✕ Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    sidebar: {
        width: '80%',
        maxWidth: 320,
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.primary,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.primary,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    menu: {
        flex: 1,
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        minHeight: 56,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    menuText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 16,
    },
    logoutItem: {
        backgroundColor: '#fee',
    },
    logoutText: {
        color: '#c53030',
    },
    closeButton: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
    },
    closeText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textLight,
    },
});
