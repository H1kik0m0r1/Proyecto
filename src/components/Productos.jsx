import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authContext'
import './Productos.css'

const productos = [
  {
    id: 1,
    nombre: 'Laptop Pro',
    precio: 1299.99,
    imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    descripcion: 'Laptop de alto rendimiento para profesionales'
  },
  {
    id: 2,
    nombre: 'Smartphone Ultra',
    precio: 899.99,
    imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    descripcion: 'El smartphone más avanzado del mercado'
  },
  {
    id: 3,
    nombre: 'Auriculares Premium',
    precio: 249.99,
    imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    descripcion: 'Sonido de calidad profesional'
  },
  {
    id: 4,
    nombre: 'Smartwatch Elite',
    precio: 399.99,
    imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    descripcion: 'Monitorea tu salud y actividad diaria'
  },
  {
    id: 5,
    nombre: 'Tablet Pro',
    precio: 599.99,
    imagen: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    descripcion: 'Perfecta para trabajo y entretenimiento'
  },
  {
    id: 6,
    nombre: 'Cámara Digital',
    precio: 799.99,
    imagen: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    descripcion: 'Captura momentos inolvidables'
  }
]

function Productos() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar que hay una sesión activa
    const session = localStorage.getItem('activeSession')
    if (!session) {
      navigate('/login')
    }
  }, [navigate])

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % productos.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + productos.length) % productos.length)
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    alert('✅ Sesión cerrada exitosamente')
    navigate('/login')
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <div className="productos-container">
      <header className="productos-header">
        <div className="header-content">
          <h1>Bienvenido, {currentUser?.nombre || 'Usuario'}</h1>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="productos-main">
        <div className="carousel-container">
          <h2 className="carousel-title">Nuestros Productos</h2>
          
          <div className="carousel">
            <button className="carousel-button prev" onClick={prevProduct}>
              ‹
            </button>
            
            <div className="product-card">
              <div className="product-image">
                <img 
                  src={productos[currentIndex].imagen} 
                  alt={productos[currentIndex].nombre}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Producto'
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{productos[currentIndex].nombre}</h3>
                <p className="product-description">{productos[currentIndex].descripcion}</p>
                <p className="product-price">${productos[currentIndex].precio.toFixed(2)}</p>
              </div>
            </div>
            
            <button className="carousel-button next" onClick={nextProduct}>
              ›
            </button>
          </div>

          <div className="carousel-indicators">
            {productos.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={cancelLogout}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>¿Estás seguro?</h3>
            <p>¿Deseas cerrar tu sesión?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="confirm-button">
                Sí, cerrar sesión
              </button>
              <button onClick={cancelLogout} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Productos

