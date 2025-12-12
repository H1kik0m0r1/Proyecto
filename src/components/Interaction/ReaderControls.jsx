import React from 'react';
import { useScreenReader } from '../../context/ScreenReaderContext';
import { useAccessibility } from '../../context/AccessibilityContext';

const ReaderControls = () => {
  const { isSpeaking, stop } = useScreenReader();
  const { visionMode } = useAccessibility();

  // Si no está hablando, no mostramos nada para no ensuciar la interfaz
  if (!isSpeaking) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 
      ${visionMode === 'blind' ? 'w-full px-4' : 'w-auto'}`}>
      
      <button 
        onClick={stop}
        className={`flex items-center justify-center gap-2 shadow-xl animate-bounce
          ${visionMode === 'blind' 
            ? 'w-full py-6 bg-yellow-400 text-black text-2xl font-bold border-4 border-black' 
            : 'px-6 py-3 bg-gray-900 text-white rounded-full text-lg font-bold'
          }`}
        aria-label="Detener lectura"
      >
        <span>🔇</span>
        <span>DETENER AUDIO</span>
      </button>
    </div>
  );
};

export default ReaderControls;