import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import './SearchDestination.css';

const SearchDestination = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { visionMode } = useAccessibility();

  // Enfocar input automáticamente al entrar (Eficiencia)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulación de búsqueda predictiva
  const handleSearch = (e) => {
    const text = e.target.value;
    setQuery(text);

    // Simulamos API de Google Places
    if (text.length > 2) {
      setResults([
        { id: 1, name: "Hospital Central", address: "Av. Siempre Viva 123", distance: "2.5 km" },
        { id: 2, name: "Centro Comercial Norte", address: "Calle 50 #10-20", distance: "4.0 km" },
        { id: 3, name: "Casa de Mamá", address: "Carrera 8 #12-34", distance: "1.2 km" }
      ]);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (place) => {
    // Feedback auditivo de confirmación
    if (visionMode !== 'standard') {
      const msg = new SpeechSynthesisUtterance(`Destino seleccionado: ${place.name}`);
      window.speechSynthesis.speak(msg);
    }
    // Pasamos el destino a la siguiente pantalla
    navigate('/ride-select', { state: { destination: place } });
  };

  return (
    <div className="search-container">
      {/* HEADER DE NAVEGACIÓN */}
      <div className="search-header">
        <button 
            onClick={() => navigate(-1)} 
            className="back-btn" 
            aria-label="Volver al mapa"
        >
          ←
        </button>
        <div className="input-wrapper">
            <span className="status-dot green" aria-hidden="true"></span>
            <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="¿A dónde vas?"
                aria-label="Ingresa tu destino"
                className="search-input"
            />
        </div>
      </div>

      {/* LISTA DE RESULTADOS (Accesible por teclado/swipe) */}
      <div className="results-list" role="listbox">
        {results.length === 0 && query.length < 3 ? (
            <div className="empty-state">
                <p>Escribe o usa voz para buscar...</p>
                {/* Atajo rápido de accesibilidad */}
                <button className="voice-shortcut-btn">
                   🎤 Dictar destino
                </button>
            </div>
        ) : (
            results.map((place) => (
                <button 
                    key={place.id} 
                    className="result-item" 
                    onClick={() => handleSelect(place)}
                    role="option"
                >
                    <div className="icon-marker">📍</div>
                    <div className="text-content">
                        <span className="place-name">{place.name}</span>
                        <span className="place-address">{place.address} • {place.distance}</span>
                    </div>
                </button>
            ))
        )}
      </div>
    </div>
  );
};

export default SearchDestination;