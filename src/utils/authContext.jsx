import { createContext, useContext, useState, useEffect, useMemo } from 'react';
// Asumimos que quieres restaurar preferencias de accesibilidad al loguearte
import { useAccessibility } from '../context/AccessibilityContext'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ESTADO
  const [user, setUser] = useState(null);
  
  // UX CRÍTICO: Estado de 'Cargando' para evitar parpadeos de pantallas incorrectas
  // Iniciamos en true porque lo primero que hacemos es verificar la sesión.
  const [isLoading, setIsLoading] = useState(true);

  const { setMode } = useAccessibility();

  // EFECTO: Restauración de Sesión (Persistencia)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem('lookism_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // MEJORA IHC: Restaurar preferencias del usuario si existen
          // Ejemplo: Si el usuario guardó que tiene ceguera total en su perfil
          if (parsedUser.preferences?.visionMode) {
            setMode(parsedUser.preferences.visionMode);
          }
        }
      } catch (error) {
        console.error("Error restaurando sesión:", error);
        localStorage.removeItem('lookism_user'); // Limpieza de datos corruptos
      } finally {
        // SIEMPRE desactivamos el loading, haya usuario o no
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [setMode]);

  // ACCIÓN: Login
  const login = (userData) => {
    // 1. Actualizar estado en memoria
    setUser(userData);
    
    // 2. Persistencia segura
    // Nota: Nunca guardes passwords planos aquí. Asegúrate que userData venga sanitizado.
    localStorage.setItem('lookism_user', JSON.stringify(userData));
    
    // 3. Feedback Auditivo (Opcional, pero recomendado en IHC)
    // Se puede delegar al componente de UI, o manejar aquí si hay un sistema de notificaciones global
  };

  // ACCIÓN: Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lookism_user');
    // Nota: Generalmente NO reseteamos las preferencias de accesibilidad al salir,
    // ya que el dispositivo sigue siendo usado por la misma persona.
  };

  // OPTIMIZACIÓN: Memoización para evitar re-renderizados innecesarios
  const value = useMemo(
    () => ({
      user,           // Objeto usuario o null
      isAuthenticated: !!user, // Booleano derivado
      isLoading,      // Vital para mostrar Spinners/Splash Screens
      login,
      logout
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}