// Firebase Configuration
//
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo
// 3. Agrega una app Web
// 4. Copia el objeto firebaseConfig y pégalo aquí
// 5. Habilita Authentication → Email/Password
// 6. Crea Firestore Database

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Reemplaza con tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyASiKlj3xzMKtJ3NKvTM-vQwcK5d23ElZ4",
    authDomain: "lookism-mobile.firebaseapp.com",
    projectId: "lookism-mobile",
    storageBucket: "lookism-mobile.firebasestorage.app",
    messagingSenderId: "899604585256",
    appId: "1:899604585256:web:5e087e2601f73b863ece1d",
    measurementId: "G-TERV636GYC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia de AsyncStorage
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Servicios
export const db = getFirestore(app);

export default app;
