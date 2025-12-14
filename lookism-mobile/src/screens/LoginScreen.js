import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';
import { registerUser, loginUser, onAuthChange, getCurrentUser } from '../services/firebaseService';
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function LoginScreen({ navigation }) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register fields
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const { theme, announce } = useAccessibility();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const unsubscribe = onAuthChange(async (user) => {
                if (user) {
                    // Usuario ya autenticado
                    const userData = await getCurrentUser();
                    if (userData) {
                        // Si ya tiene modo de visión, ir a Home
                        if (userData.visionMode) {
                            navigation.replace('Home');
                        } else {
                            navigation.replace('VisionSelector');
                        }
                    }
                } else {
                    setLoading(false);
                }
            });

            return unsubscribe;
        } catch (error) {
            console.error('Error checking auth:', error);
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            announce('Por favor ingresa email y contraseña');
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setSubmitting(true);
        const result = await loginUser(loginEmail, loginPassword);
        setSubmitting(false);

        if (result.success) {
            announce('Inicio de sesión exitoso');

            // Verificar si ya tiene modo de visión configurado
            if (result.user.visionMode) {
                navigation.replace('Home');
            } else {
                navigation.replace('VisionSelector');
            }
        } else {
            announce(result.error);
            Alert.alert('Error', result.error);
        }
    };

    const handleRegister = async () => {
        // Validaciones
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            announce('Por favor completa todos los campos');
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            announce('Las contraseñas no coinciden');
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        if (registerPassword.length < 6) {
            announce('La contraseña debe tener al menos 6 caracteres');
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setSubmitting(true);
        const result = await registerUser(registerEmail, registerPassword, registerName);
        setSubmitting(false);

        if (result.success) {
            announce('Registro exitoso. Bienvenido a Lookism');
            Alert.alert(
                'Registro Exitoso',
                'Tu cuenta ha sido creada correctamente',
                [
                    {
                        text: 'Continuar',
                        onPress: () => navigation.replace('VisionSelector'),
                    },
                ]
            );
        } else {
            announce(result.error);
            Alert.alert('Error', result.error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textLight }]}>Verificando sesión...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.colors.primary, fontSize: theme.fontSizes.title }]}>
                    LOOKISM
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.text, fontSize: theme.fontSizes.normal }]}>
                    Transporte Accesible
                </Text>

                {/* Tabs */}
                <View style={[styles.tabs, { backgroundColor: theme.colors.cardBg }]}>
                    <TouchableOpacity
                        style={[styles.tab, isLogin && { backgroundColor: theme.colors.primary }]}
                        onPress={() => {
                            setIsLogin(true);
                            announce('Modo iniciar sesión');
                        }}
                        accessible={true}
                        accessibilityLabel="Iniciar sesión"
                        accessibilityRole="tab"
                    >
                        <Text style={[styles.tabText, { color: isLogin ? '#fff' : theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                            Iniciar Sesión
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, !isLogin && { backgroundColor: theme.colors.primary }]}
                        onPress={() => {
                            setIsLogin(false);
                            announce('Modo registrarse');
                        }}
                        accessible={true}
                        accessibilityLabel="Registrarse"
                        accessibilityRole="tab"
                    >
                        <Text style={[styles.tabText, { color: !isLogin ? '#fff' : theme.colors.textLight, fontSize: theme.fontSizes.small }]}>
                            Registrarse
                        </Text>
                    </TouchableOpacity>
                </View>

                {isLogin ? (
                    // LOGIN FORM
                    <View>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Email"
                            placeholderTextColor={theme.colors.textLight}
                            value={loginEmail}
                            onChangeText={setLoginEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            accessible={true}
                            accessibilityLabel="Campo de email"
                        />

                        <TextInput
                            style={[styles.input, {
                                marginTop: 16,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Contraseña"
                            placeholderTextColor={theme.colors.textLight}
                            value={loginPassword}
                            onChangeText={setLoginPassword}
                            secureTextEntry
                            accessible={true}
                            accessibilityLabel="Campo de contraseña"
                        />

                        <TouchableOpacity
                            style={[styles.button, { marginTop: 24, backgroundColor: theme.colors.primary }]}
                            onPress={handleLogin}
                            disabled={submitting}
                            accessible={true}
                            accessibilityLabel="Iniciar sesión"
                            accessibilityRole="button"
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { fontSize: theme.fontSizes.large }]}>
                                    Iniciar Sesión
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    // REGISTER FORM
                    <View>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Nombre completo"
                            placeholderTextColor={theme.colors.textLight}
                            value={registerName}
                            onChangeText={setRegisterName}
                            accessible={true}
                            accessibilityLabel="Campo de nombre"
                        />

                        <TextInput
                            style={[styles.input, {
                                marginTop: 16,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Email"
                            placeholderTextColor={theme.colors.textLight}
                            value={registerEmail}
                            onChangeText={setRegisterEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            accessible={true}
                            accessibilityLabel="Campo de email"
                        />

                        <TextInput
                            style={[styles.input, {
                                marginTop: 16,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Contraseña (mínimo 6 caracteres)"
                            placeholderTextColor={theme.colors.textLight}
                            value={registerPassword}
                            onChangeText={setRegisterPassword}
                            secureTextEntry
                            accessible={true}
                            accessibilityLabel="Campo de contraseña"
                        />

                        <TextInput
                            style={[styles.input, {
                                marginTop: 16,
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.cardBg,
                                fontSize: theme.fontSizes.normal
                            }]}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={theme.colors.textLight}
                            value={registerConfirmPassword}
                            onChangeText={setRegisterConfirmPassword}
                            secureTextEntry
                            accessible={true}
                            accessibilityLabel="Confirmar contraseña"
                        />

                        <TouchableOpacity
                            style={[styles.button, { marginTop: 24, backgroundColor: theme.colors.primary }]}
                            onPress={handleRegister}
                            disabled={submitting}
                            accessible={true}
                            accessibilityLabel="Registrarse"
                            accessibilityRole="button"
                        >
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { fontSize: theme.fontSizes.large }]}>
                                    Registrarse
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 16,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 24,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabText: {
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        minHeight: 56,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
