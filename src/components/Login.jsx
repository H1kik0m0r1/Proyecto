import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authContext'
import { verifyUser, saveUser } from '../utils/userStorage'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isLogin) {
      // Proceso de login
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos')
        return
      }

      const result = verifyUser(formData.email, formData.password)
      if (result.success) {
        login(result.user)
        navigate('/productos')
      } else {
        setError(result.message)
      }
    } else {
      // Proceso de registro
      if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Por favor completa todos los campos')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }

      try {
        const userData = {
          id: Date.now(),
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          fechaRegistro: new Date().toISOString()
        }
        
        saveUser(userData)
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión')
        setTimeout(() => {
          setIsLogin(true)
          setFormData({ nombre: '', email: '', password: '', confirmPassword: '' })
        }, 2000)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
          <p>{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-button">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ nombre: '', email: '', password: '', confirmPassword: '' })
                setError('')
                setSuccess('')
              }}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

