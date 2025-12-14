import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import BackButton from '../components/BackButton';

const DESTINATIONS = [
    { id: 1, name: 'Hospital Central', address: 'Av. Salud 500', price: 45 },
    { id: 2, name: 'Centro Comercial Plaza', address: 'Boulevard Norte 200', price: 60 },
    { id: 3, name: 'Universidad Nacional', address: 'Campus Principal', price: 35 },
    { id: 4, name: 'Aeropuerto Internacional', address: 'Zona Aeroportuaria', price: 120 },
    { id: 5, name: 'Parque Central', address: 'Centro de la Ciudad', price: 25 },
];

export default function SearchDestinationScreen({ navigation, route }) {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState(DESTINATIONS);

    const { theme, announce } = useAccessibility();

    useEffect(() => {
        announce('Búsqueda de destino. Escribe o selecciona un lugar.');
    }, []);

    useEffect(() => {
        if (search) {
            const results = DESTINATIONS.filter(d =>
                d.name.toLowerCase().includes(search.toLowerCase())
            );
            setFiltered(results);
        } else {
            setFiltered(DESTINATIONS);
        }
    }, [search]);

    const selectDestination = (dest) => {
        announce(`Destino seleccionado: ${dest.name}. Buscando conductor.`);
        navigation.navigate('TripTracking', {
            destination: dest,
            userLocation: route.params?.userLocation || {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <BackButton onPress={() => navigation.goBack()} />

            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.fontSizes.title }]}>
                ¿A dónde vas?
            </Text>

            <TouchableOpacity
                style={[styles.savedButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('SavedAddresses')}
                accessible={true}
                accessibilityLabel="Ver direcciones guardadas"
                accessibilityRole="button"
            >
                <Text style={[styles.savedButtonText, { fontSize: theme.fontSizes.normal }]}>
                    📍 Direcciones Guardadas
                </Text>
            </TouchableOpacity>

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.cardBg,
                    fontSize: theme.fontSizes.normal
                }]}
                placeholder="Buscar destino..."
                placeholderTextColor={theme.colors.textLight}
                value={search}
                onChangeText={setSearch}
                accessible={true}
                accessibilityLabel="Campo de búsqueda de destino"
                accessibilityHint="Escribe el nombre del lugar al que quieres ir"
            />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id.toString()}
                style={{ marginTop: 16 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.destCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                        onPress={() => selectDestination(item)}
                        accessible={true}
                        accessibilityLabel={`${item.name}, ${item.address}, ${item.price} pesos`}
                        accessibilityRole="button"
                    >
                        <Text style={[styles.destName, { color: theme.colors.text, fontSize: theme.fontSizes.large }]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.destAddress, { color: theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                            {item.address}
                        </Text>
                        <Text style={[styles.destPrice, { color: theme.colors.primary, fontSize: theme.fontSizes.xlarge }]}>
                            ${item.price}
                        </Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.colors.textLight, fontSize: theme.fontSizes.normal }]}>
                        No se encontraron destinos
                    </Text>
                }
            />
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
        marginBottom: 16,
    },
    savedButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        minHeight: 56,
        justifyContent: 'center',
    },
    savedButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    input: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        minHeight: 56,
    },
    destCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    destName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    destAddress: {
        marginBottom: 8,
    },
    destPrice: {
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
    },
});
