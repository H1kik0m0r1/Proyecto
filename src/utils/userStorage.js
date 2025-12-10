// Utilidades para guardar y recuperar usuarios del localStorage

const USERS_KEY = 'registeredUsers'

export const saveUser = (userData) => {
  const users = getUsers()
  // Verificar si el usuario ya existe
  const userExists = users.find(u => u.email === userData.email)
  
  if (userExists) {
    throw new Error('Este correo electrónico ya está registrado')
  }
  
  users.push(userData)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return true
}

export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export const findUserByEmail = (email) => {
  const users = getUsers()
  return users.find(u => u.email === email)
}

export const verifyUser = (email, password) => {
  const user = findUserByEmail(email)
  if (!user) {
    return { success: false, message: 'Usuario no encontrado' }
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Contraseña incorrecta' }
  }
  
  return { success: true, user }
}

