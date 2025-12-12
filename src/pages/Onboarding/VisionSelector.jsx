import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';

const VisionSelector = () => {
  const { setMode, visionMode } = useAccessibility();
  const navigate = useNavigate();

  // Función auxiliar para manejar la selección y dar feedback
  const handleSelection = (mode) => {
    setMode(mode);
    // Feedback auditivo simple (puedes expandirlo con una API de TTS real)
    if (mode === 'blind') {
      const msg = new SpeechSynthesisUtterance("Modo ceguera total activado. Comandos de voz habilitados.");
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <main className="p-6 flex flex-col h-screen justify-between">
      <div>
        <h1 tabIndex="0" className="text-3xl font-bold mb-4 focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-lg">
          Visión
        </h1>
        <p className="mb-8 text-lg" tabIndex="0">
          Bienvenido, selecciona tu modo de accesibilidad preferido.
        </p>

        <form className="space-y-6" role="radiogroup" aria-labelledby="vision-label">
          <span id="vision-label" className="sr-only">Opciones de visión</span>

          {/* Opción 1: Ceguera Total */}
          <label 
            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all
              ${visionMode === 'blind' ? 'border-green-600 bg-green-50' : 'border-gray-300'}
            `}
          >
            <div className="flex items-center">
              <input 
                type="radio" 
                name="vision" 
                value="blind" 
                checked={visionMode === 'blind'}
                onChange={() => handleSelection('blind')}
                className="w-6 h-6 text-green-600 focus:ring-green-500"
              />
              <span className="ml-4 text-xl font-bold">Ceguera total</span>
            </div>
          </label>

          {/* Opción 2: Discapacidad Visual */}
          <label 
            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all
              ${visionMode === 'low-vision' ? 'border-green-600 bg-green-50' : 'border-gray-300'}
            `}
          >
            <div className="flex items-center">
              <input 
                type="radio" 
                name="vision" 
                value="low-vision" 
                checked={visionMode === 'low-vision'}
                onChange={() => handleSelection('low-vision')}
                className="w-6 h-6 text-green-600 focus:ring-green-500"
              />
              <span className="ml-4 text-xl font-bold">Discapacidad visual</span>
            </div>
          </label>

          {/* Opción 3: Sin Discapacidad */}
          <label 
            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all
              ${visionMode === 'standard' ? 'border-green-600 bg-green-50' : 'border-gray-300'}
            `}
          >
            <div className="flex items-center">
              <input 
                type="radio" 
                name="vision" 
                value="standard" 
                checked={visionMode === 'standard'}
                onChange={() => handleSelection('standard')}
                className="w-6 h-6 text-green-600 focus:ring-green-500"
              />
              <span className="ml-4 text-xl font-bold">Sin discapacidad visual</span>
            </div>
          </label>
        </form>
      </div>

      <button 
        onClick={() => navigate('/home')}
        className="w-full bg-black text-white py-4 rounded-xl text-xl font-bold hover:bg-gray-800 focus:ring-4 focus:ring-green-500 focus:outline-none"
      >
        Siguiente
      </button>
    </main>
  );
};

export default VisionSelector;