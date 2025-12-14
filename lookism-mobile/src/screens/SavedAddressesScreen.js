import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import {
    getAddresses,
    saveAddress,
    updateAddress,
    deleteAddress,
} from '../services/addressService';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useVoiceNavigation } from '../contexts/VoiceNavigationContext';
import BackButton from '../components/BackButton';

export default function SavedAddressesScreen({ navigation, route }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    // Form state
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('custom');

    const { theme, announce, isScreenReaderActive } = useAccessibility();
    const { announcements } = useVoiceNavigation();

    useEffect(() => {
        loadAddresses();
        announcements.screenEntered('Direcciones guardadas', 'Administra tus ubicaciones favoritas');
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        const data = await getAddresses();
        setAddresses(data);
        setLoading(false);

        if (data.length === 0) {
            announce('No tienes direcciones guardadas. Agrega una nueva.');
        } else {
            announce(`${data.length} direcciones guardadas`);
        }
    };

    const openAddModal = () => {
        setEditingAddress(null);
        setName('');
        setAddress('');
        setType('custom');
        setModalVisible(true);
        announce('Formulario para agregar nueva dirección');
    };

    const openEditModal = (addr) => {
        setEditingAddress(addr);
        setName(addr.name);
        setAddress(addr.address);
        setType(addr.type);
        setModalVisible(true);
        announce(`Editando ${addr.name}`);
    };

    const handleSave = async () => {
        if (!name || !address) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            announce('Error. Completa todos los campos');
            return;
        }

        setModalVisible(false);

        if (editingAddress) {
            await updateAddress(editingAddress.id, { name, address, type });
            announce(`${name} actualizada`);
        } else {
            // Get current location for coordinates
            try {
                const location = await Location.getCurrentPositionAsync({});
                await saveAddress({
                    name,
                    address,
                    type,
                    coordinates: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                });
                announce(`${name} guardada exitosamente`);
            } catch (error) {
                await saveAddress({ name, address, type, coordinates: null });
                announce(`${name} guardada sin coordenadas`);
            }
        }

        loadAddresses();
    };

    const handleDelete = (addr) => {
        Alert.alert(
            'Eliminar Dirección',
            `¿Deseas eliminar "${addr.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteAddress(addr.id);
                        announce(`${addr.name} eliminada`);
                        loadAddresses();
                    },
                },
            ]
        );
    };

    const handleSelect = (addr) => {
        announce(`Usando dirección ${addr.name}`);
        // Volver a SearchDestination con la dirección seleccionada
        navigation.navigate('SearchDestination', {
            selectedAddress: addr,
        });
    };

    const getTypeLabel = (typeValue) => {
        const labels = {
            home: '🏠 Casa',
            work: '💼 Trabajo',
            custom: '📍 Personalizada',
        };
        return labels[typeValue] || labels.custom;
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackButton onPress={() => navigation.goBack()} />

            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                Direcciones Guardadas
            </Text>

            {addresses.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>📍</Text>
                    <Text style={[styles.emptyText, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                        No hay direcciones guardadas
                    </Text>
                    <Text style={[styles.emptyHint, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                        Agrega tus lugares favoritos para acceso rápido
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                            accessible={true}
                            accessibilityLabel={`${item.name}, tipo ${getTypeLabel(item.type)}, ${item.address}`}
                            accessibilityHint="Toca para usar, mantén presionado para opciones"
                        >
                            <TouchableOpacity
                                style={styles.cardContent}
                                onPress={() => handleSelect(item)}
                                accessible={false}
                            >
                                <Text style={[styles.typeLabel, { fontSize: theme.fontSizes.small }]}>
                                    {getTypeLabel(item.type)}
                                </Text>
                                <Text style={[styles.addressName, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                                    {item.name}
                                </Text>
                                <Text style={[styles.addressText, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                                    {item.address}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={() => openEditModal(item)}
                                    accessible={true}
                                    accessibilityLabel={`Editar ${item.name}`}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.actionIcon}>✏️</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
                                    onPress={() => handleDelete(item)}
                                    accessible={true}
                                    accessibilityLabel={`Eliminar ${item.name}`}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.actionIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={openAddModal}
                accessible={true}
                accessibilityLabel="Agregar nueva dirección"
                accessibilityRole="button"
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Modal de agregar/editar */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text, fontSize: theme.fontSizes.xlarge }]}>
                            {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                        </Text>

                        <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                            Tipo:
                        </Text>
                        <View style={styles.typeButtons}>
                            {['home', 'work', 'custom'].map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.typeButton,
                                        { borderColor: theme.colors.border },
                                        type === t && { backgroundColor: theme.colors.primary },
                                    ]}
                                    onPress={() => setType(t)}
                                    accessible={true}
                                    accessibilityLabel={getTypeLabel(t)}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: type === t }}
                                >
                                    <Text style={[styles.typeButtonText, type === t && { color: '#fff' }]}>
                                        {getTypeLabel(t)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                            Nombre:
                        </Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, fontSize: theme.fontSizes.normal }]}
                            placeholder="Ej: Mi Casa"
                            value={name}
                            onChangeText={setName}
                            accessible={true}
                            accessibilityLabel="Nombre de la dirección"
                        />

                        <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                            Dirección:
                        </Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, fontSize: theme.fontSizes.normal }]}
                            placeholder="Ej: Av. Principal 123"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            accessible={true}
                            accessibilityLabel="Dirección completa"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#6b7280' }]}
                                onPress={() => setModalVisible(false)}
                                accessible={true}
                                accessibilityLabel="Cancelar"
                                accessibilityRole="button"
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                                onPress={handleSave}
                                accessible={true}
                                accessibilityLabel={editingAddress ? 'Guardar cambios' : 'Agregar dirección'}
                                accessibilityRole="button"
                            >
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 20,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    cardContent: {
        marginBottom: 12,
    },
    typeLabel: {
        marginBottom: 4,
    },
    addressName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    addressText: {
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 20,
        padding: 24,
        maxHeight: '90%',
    },
    modalTitle: {
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 8,
    },
    typeButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        minHeight: 48,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
