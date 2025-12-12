import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/authContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { visionMode, setMode } = useAccessibility();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // GESTIÓN DE FOCO (Accessibility Requirement)
  // Cuando el menú se abre, llevamos el foco al primer elemento para que el lector no se pierda.
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Volver al Login
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Cerrar menú al navegar
  };

  return (
    <>
      {/* Overlay Oscuro (Clic para cerrar) */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel Lateral */}
      <nav 
        ref={sidebarRef}
        className={`sidebar-panel ${isOpen ? 'open' : ''} ${visionMode}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        tabIndex="-1" // Permite recibir foco programático
      >
        <div className="sidebar-header">
          <div className="user-profile-summary">
            <div className="avatar-large">
               {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-text">
                <h3>{user?.nombre || 'Usuario'}</h3>
                <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <ul className="sidebar-links">
          <li>
            <button onClick={() => handleNavigation('/home')} className="nav-item">
              🏠 Inicio
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('/history')} className="nav-item">
              🕒 Mis Viajes
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation('/payment')} className="nav-item">
              💳 Métodos de Pago
            </button>
          </li>
          
          {/* SECCIÓN DE ACCESIBILIDAD (Crucial para configuración en tiempo real) */}
          <li className="separator" role="separator" />
          <li className="group-title">Accesibilidad</li>
          
          <li className="radio-group">
            <label className={`access-option ${visionMode === 'standard' ? 'active' : ''}`}>
                <input 
                    type="radio" 
                    name="mode" 
                    checked={visionMode === 'standard'} 
                    onChange={() => setMode('standard')}
                />
                <span>Vista Estándar</span>
            </label>
            <label className={`access-option ${visionMode === 'low-vision' ? 'active' : ''}`}>
                <input 
                    type="radio" 
                    name="mode" 
                    checked={visionMode === 'low-vision'} 
                    onChange={() => setMode('low-vision')}
                />
                <span>Baja Visión (Alto Contraste)</span>
            </label>
            <label className={`access-option ${visionMode === 'blind' ? 'active' : ''}`}>
                <input 
                    type="radio" 
                    name="mode" 
                    checked={visionMode === 'blind'} 
                    onChange={() => setMode('blind')}
                />
                <span>Lectura de Pantalla (Ciego)</span>
            </label>
          </li>

          <li className="separator" role="separator" />
          
          <li>
            <button onClick={handleLogout} className="nav-item logout">
              🚪 Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;