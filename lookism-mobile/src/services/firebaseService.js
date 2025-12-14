import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// ============ AUTHENTICATION ============

/**
 * Registrar nuevo usuario
 * @param {string} email
 * @param {string} password  
 * @param {string} nombre
 * @returns {Promise<{success: boolean, user: object, error: string}>}
 */
export const registerUser = async (email, password, nombre) => {
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar perfil en Firestore
        await setDoc(doc(db, 'users', user.uid), {
            nombre: nombre,
            email: email,
            visionMode: null,
            createdAt: new Date().toISOString(),
        });

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                nombre: nombre,
            },
        };
    } catch (error) {
        let errorMessage = 'Error al registrar usuario';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este correo ya está registrado';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Correo electrónico inválido';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
};

/**
 * Iniciar sesión
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user: object, error: string}>}
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener perfil de Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
            return {
                success: true,
                user: {
                    uid: user.uid,
                    ...userDoc.data(),
                },
            };
        } else {
            return {
                success: false,
                error: 'Perfil de usuario no encontrado',
            };
        }
    } catch (error) {
        let errorMessage = 'Error al iniciar sesión';

        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Correo o contraseña incorrectos';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Correo electrónico inválido';
        }

        return {
            success: false,
            error: errorMessage,
        };
    }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Obtener usuario actual
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
        return {
            uid: user.uid,
            ...userDoc.data(),
        };
    }
    return null;
};

/**
 * Observador de estado de autenticación
 * @param {function} callback
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ============ USER PROFILE ============

/**
 * Actualizar modo de visión
 * @param {string} uid
 * @param {string} mode
 */
export const updateVisionMode = async (uid, mode) => {
    try {
        await setDoc(doc(db, 'users', uid), { visionMode: mode }, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ============ TRIPS ============

/**
 * Guardar viaje
 * @param {string} userId
 * @param {object} tripData
 */
export const saveTrip = async (userId, tripData) => {
    try {
        await addDoc(collection(db, 'trips'), {
            userId: userId,
            destination: tripData.destination,
            address: tripData.address,
            price: tripData.price,
            payment: tripData.payment,
            status: tripData.status || 'completed',
            date: new Date().toISOString(),
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * Obtener viajes del usuario
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserTrips = async (userId) => {
    try {
        // Query sin orderBy para evitar requerir índice compuesto
        const q = query(
            collection(db, 'trips'),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const trips = [];

        querySnapshot.forEach((doc) => {
            trips.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Ordenar en JavaScript en lugar de Firestore
        trips.sort((a, b) => new Date(b.date) - new Date(a.date));

        return trips;
    } catch (error) {
        console.error('Error getting trips:', error);
        return [];
    }
};
