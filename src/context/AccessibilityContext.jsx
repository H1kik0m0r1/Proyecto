import React, { createContext, useState, useEffect, useContext } from 'react';


// Definimos el contexto
const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // ESTADOS: Definen el "Modelo del Usuario" actual
  // 1. visionMode: 'blind' (Ceguera total), 'low-vision' (Baja visión), 'standard' (Sin discapacidad)
  // Referencia a tu pantalla de selección de visión
  const [visionMode, setVisionMode] = useState(() => {
    return localStorage.getItem('visionMode') || 'standard';
    
  });
  function App() {
  return (
    <AccessibilityProvider>
      <ScreenReaderProvider> {/* <--- NUEVO PROVIDER */}
        <AuthProvider>
          <Router>
             {/* ... tus rutas ... */}
             
             {/* Coloca el control flotante aquí para que aparezca en todas las pantallas */}
             <ReaderControls /> 
          </Router>
        </AuthProvider>
      </ScreenReaderProvider>
    </AccessibilityProvider>
  );
}

  // 2. highContrast: Para usuarios con baja visión que necesitan alto contraste (WCAG)
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  // 3. voiceEnabled: Activa la interacción multimodal (IMM) [cite: 90]
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('voiceEnabled') === 'true';
  });

  // EFECTOS: Reaccionan a los cambios de estado (Feedback del Sistema)
  useEffect(() => {
    // Persistencia: Guardar en localStorage
    localStorage.setItem('visionMode', visionMode);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('voiceEnabled', voiceEnabled);

    // Manipulación del DOM para estilos globales
    const body = document.body;
    
    // Aplicar clase para modo Alto Contraste (útil para Tailwind/CSS)
    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Aplicar clase para tamaño de fuente base según el modo
    if (visionMode === 'low-vision') {
      document.documentElement.style.fontSize = '120%'; // Aumenta escala base
    } else {
      document.documentElement.style.fontSize = '100%';
    }

  }, [visionMode, highContrast, voiceEnabled]);

  // FUNCIONES DE CONTROL (Heurística: Control y libertad del usuario) [cite: 42]
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleVoice = () => setVoiceEnabled(prev => !prev);
  
  const setMode = (mode) => {
    setVisionMode(mode);
    // Configuración automática sugerida basada en el modo
    if (mode === 'blind') {
      setVoiceEnabled(true);
      setHighContrast(false); // No es necesario si no ven la pantalla
    } else if (mode === 'low-vision') {
      setHighContrast(true);
      setVoiceEnabled(true); // Ayuda híbrida
    } else {
      setVoiceEnabled(false);
      setHighContrast(false);
    }
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        visionMode, 
        setMode, 
        highContrast, 
        toggleHighContrast, 
        voiceEnabled, 
        toggleVoice 
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de un AccessibilityProvider');
  }
  return context;
};