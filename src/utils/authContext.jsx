import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const session = localStorage.getItem('activeSession')
    const user = localStorage.getItem('currentUser')
    
    if (session && user) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const login = (user) => {
    setIsAuthenticated(true)
    setCurrentUser(user)
    localStorage.setItem('activeSession', 'true')
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    localStorage.removeItem('activeSession')
    localStorage.removeItem('currentUser')
  }

  const value = useMemo(
    () => ({ isAuthenticated, currentUser, login, logout }),
    [isAuthenticated, currentUser]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

