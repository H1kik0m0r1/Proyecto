/**
 * SERVICIO DE ALMACENAMIENTO (Simulación de Backend)
 * * Principios IHC aplicados:
 * 1. Asincronía: Para permitir feedback de "Cargando..." (Visibilidad del estado).
 * 2. Normalización: Sanitización de inputs para prevenir errores humanos (Prevención).
 * 3. Respuestas Semánticas: Para que el lector de pantalla sepa exactamente qué pasó.
 */

const USERS_KEY = 'registeredUsers';

// Helper para simular latencia de red (Vital para probar spinners y aria-busy)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper interno seguro para leer localStorage (Manejo de excepciones)
const getLocalUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error crítico leyendo localStorage", error);
    // Fallback seguro para no romper la app
    return [];
  }
};

/**
 * Registra un nuevo usuario
 * Retorna una promesa con el resultado estructurado
 */
export const saveUser = async (userData) => {
  await delay(800); // Simulamos tiempo de escritura en base de datos

  const users = getLocalUsers();
  
  // Normalización: Guardamos el email en minúsculas para evitar duplicados por case-sensitivity
  const normalizedEmail = userData.email.toLowerCase().trim();

  // Validación de unicidad
  const userExists = users.find(u => u.email.toLowerCase() === normalizedEmail);
  
  if (userExists) {
    return {
      success: false,
      error: {
        code: 'REGISTRATION_DUPLICATE',
        message: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.',
        field: 'email' // Para hacer focus en el input
      }
    };
  }

  // Guardado
  const newUser = { 
    ...userData, 
    email: normalizedEmail,
    id: Date.now().toString(), // ID único simple
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return { success: true, user: newUser };
};

/**
 * Obtiene todos los usuarios (Asíncrono para consistencia)
 */
export const getUsers = async () => {
  await delay(200);
  return getLocalUsers();
};

/**
 * Busca un usuario por email
 */
export const findUserByEmail = async (email) => {
  await delay(300);
  const users = getLocalUsers();
  const searchEmail = email.toLowerCase().trim();
  return users.find(u => u.email === searchEmail);
};

/**
 * Verifica credenciales para Login
 */
export const verifyUser = async (email, password) => {
  await delay(800); // Feedback de espera para el usuario

  const searchEmail = email.toLowerCase().trim();
  const users = getLocalUsers();
  const user = users.find(u => u.email === searchEmail);

  // ERROR 1: Identificación
  if (!user) {
    return { 
      success: false, 
      error: {
        code: 'AUTH_USER_NOT_FOUND',
        message: 'No encontramos una cuenta con este correo.',
        field: 'email'
      }
    };
  }
  
  // ERROR 2: Autenticación
  // Nota: En producción, aquí se compararía el hash, no el texto plano.
  if (user.password !== password) {
    return { 
      success: false, 
      error: {
        code: 'AUTH_WRONG_PASSWORD',
        message: 'La contraseña es incorrecta.',
        field: 'password'
      }
    };
  }
  
  // Éxito: Retornamos el usuario sin la contraseña para seguridad en el frontend
  const { password: _, ...safeUser } = user;
  
  return { success: true, user: safeUser };
};
