import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import './RideSelection.css';

const RIDE_OPTIONS = [
  { id: 'standard', name: 'Standard', price: '$150', time: '3 min', icon: '🚗', desc: 'Auto compacto para 4 personas' },
  { id: 'pets', name: 'LKS Pets', price: '$180', time: '5 min', icon: '🐕', desc: 'Apto para mascotas y perros guía' }, // Crucial para ciegos
  { id: 'van', name: 'LKS Van', price: '$250', time: '8 min', icon: '🚐', desc: 'Camioneta para 6 personas o equipaje' }
];

const RideSelection = () => {
  const { state } = useLocation(); // Recibimos el destino
  const [selectedRide, setSelectedRide] = useState(RIDE_OPTIONS[0].id);
  const navigate = useNavigate();
  const { visionMode } = useAccessibility();

  const handleConfirm = () => {
    // Feedback vibratorio
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
    navigate('/trip-status'); // Iría a la pantalla de viaje en curso
  };

  return (
    <div className={`ride-selection-container ${visionMode}`}>
      {/* MAPA ESTÁTICO DE FONDO (Contexto visual reducido) */}
      <div className="mini-map-header" aria-hidden="true">
        {/* Placeholder visual de la ruta */}
        <div className="route-line"></div> 
      </div>

      {/* PANEL DE SELECCIÓN */}
      <main className="selection-panel">
        <h1 className="sr-only">Selecciona tu tipo de viaje</h1>
        
        <div className="destination-summary" tabIndex="0">
            <span className="label">Destino:</span>
            <h3>{state?.destination?.name || "Destino seleccionado"}</h3>
        </div>

        <div className="options-list" role="radiogroup" aria-label="Opciones de vehículo">
          {RIDE_OPTIONS.map((option) => (
            <div 
                key={option.id}
                onClick={() => setSelectedRide(option.id)}
                className={`ride-option ${selectedRide === option.id ? 'selected' : ''}`}
                role="radio"
                aria-checked={selectedRide === option.id}
                tabIndex="0"
                // El aria-label une toda la info para que el lector la diga de una vez
                aria-label={`${option.name}, Precio ${option.price}, Llega en ${option.time}. ${option.desc}`}
            >
              <div className="ride-icon">{option.icon}</div>
              <div className="ride-details">
                <span className="ride-name">{option.name}</span>
                <span className="ride-time">{option.time}</span>
              </div>
              <div className="ride-price">
                {option.price}
              </div>
            </div>
          ))}
        </div>

        {/* BOTÓN DE ACCIÓN (Sticky Footer) */}
        <div className="action-footer">
            <div className="payment-method">
                <span>💳 Visa **** 4242</span>
            </div>
            <button 
                className="confirm-btn" 
                onClick={handleConfirm}
                aria-label={`Confirmar ${RIDE_OPTIONS.find(r => r.id === selectedRide).name} por ${RIDE_OPTIONS.find(r => r.id === selectedRide).price}`}
            >
                Confirmar Viaje
            </button>
        </div>
      </main>
    </div>
  );
};

export default RideSelection;
