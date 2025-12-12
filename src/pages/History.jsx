import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import './History.css';

// Datos simulados (Mock Data)
const MOCK_TRIPS = [
  { id: 1, date: 'Hoy, 10:30 AM', dest: 'Hospital Central', price: '$150', status: 'completed', driver: 'Carlos' },
  { id: 2, date: 'Ayer, 08:00 PM', dest: 'Casa de Mamá', price: '$120', status: 'completed', driver: 'Ana' },
  { id: 3, date: '12 Oct, 2023', dest: 'Centro Comercial', price: '$0', status: 'cancelled', driver: null },
];

const History = ({ onOpenMenu }) => {
  const { visionMode } = useAccessibility();
  const navigate = useNavigate();

  const handleRepeatTrip = (trip) => {
    // Patrón de Diseño: Eficiencia. 
    // Saltamos la búsqueda y vamos directo a selección de vehículo con el destino precargado.
    navigate('/ride-select', { state: { destination: { name: trip.dest } } });
  };

  return (
    <div className={`history-container ${visionMode}`}>
      {/* Header Consistente */}
      <header className="history-header">
        <button onClick={onOpenMenu} className="icon-btn" aria-label="Abrir menú">
            ☰
        </button>
        <h1>Mis Viajes</h1>
      </header>

      <main className="history-list" role="feed" aria-label="Lista de viajes pasados">
        {MOCK_TRIPS.map((trip) => (
            <article 
                key={trip.id} 
                className={`trip-card ${trip.status}`}
                tabIndex="0" // Permite foco para lectura detallada
                aria-label={`Viaje a ${trip.dest}, ${trip.date}. Estado: ${trip.status === 'completed' ? 'Completado' : 'Cancelado'}.`}
            >
                <div className="trip-info">
                    <div className="trip-date">{trip.date}</div>
                    <h2 className="trip-dest">{trip.dest}</h2>
                    <div className="trip-meta">
                        {trip.status === 'completed' 
                            ? `Conductor: ${trip.driver} • ${trip.price}` 
                            : <span className="status-cancelled">Cancelado</span>
                        }
                    </div>
                </div>
                
                {/* Acción Principal: Repetir (Affordance clara) */}
                {trip.status === 'completed' && (
                    <button 
                        className="repeat-btn"
                        onClick={(e) => {
                            e.stopPropagation(); // Evitar disparar el click de la tarjeta si hubiera
                            handleRepeatTrip(trip);
                        }}
                        aria-label={`Repetir viaje a ${trip.dest}`}
                    >
                        ↻
                    </button>
                )}
            </article>
        ))}
      </main>
    </div>
  );
};

export default History;