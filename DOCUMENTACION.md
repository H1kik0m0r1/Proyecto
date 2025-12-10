# 📚 Documentación Técnica - Proyecto Lina

## 📋 Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Detallados](#componentes-detallados)
5. [Sistema de Autenticación](#sistema-de-autenticación)
6. [Almacenamiento Local](#almacenamiento-local)
7. [Guía de Modificaciones](#guía-de-modificaciones)
8. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🏗️ Arquitectura del Proyecto

### Tecnologías Utilizadas

- **React 18**: Biblioteca para construir interfaces de usuario
- **React Router DOM**: Navegación entre páginas
- **Vite**: Herramienta de build y servidor de desarrollo
- **localStorage**: Almacenamiento persistente en el navegador
- **Context API**: Gestión de estado global (autenticación)

### Patrón de Arquitectura

```
┌─────────────────────────────────────────┐
│           App.jsx (Router)              │
│  ┌───────────────────────────────────┐ │
│  │      AuthProvider (Context)       │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │   Routes                    │  │ │
│  │  │  - /login → Login           │  │ │
│  │  │  - /productos → Productos   │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
   Login.jsx          Productos.jsx
         │                    │
         ▼                    ▼
   userStorage.js     authContext.jsx
         │                    │
         ▼                    ▼
    localStorage      localStorage
```

---

## 📁 Estructura de Archivos

```
proyecto lina/
│
├── public/                    # Archivos estáticos (si los hay)
│
├── src/
│   ├── components/            # Componentes React
│   │   ├── Login.jsx         # Formulario de login/registro
│   │   ├── Login.css         # Estilos del login
│   │   ├── Productos.jsx     # Página de productos con carrusel
│   │   └── Productos.css     # Estilos de productos
│   │
│   ├── utils/                # Utilidades y lógica de negocio
│   │   ├── authContext.jsx   # Context API para autenticación
│   │   └── userStorage.js    # Funciones de almacenamiento
│   │
│   ├── App.jsx               # Componente raíz con rutas
│   ├── main.jsx              # Punto de entrada de React
│   └── index.css             # Estilos globales
│
├── index.html                # HTML principal
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
├── README.md                 # Documentación básica
└── DOCUMENTACION.md          # Esta documentación
```

---

## 🔄 Flujo de Datos

### 1. Flujo de Registro

```
Usuario llena formulario
    ↓
Login.jsx → handleSubmit()
    ↓
Validación de campos
    ↓
saveUser(userData) → userStorage.js
    ↓
getUsers() → Lee localStorage
    ↓
Verifica si email existe
    ↓
Agrega usuario al array
    ↓
localStorage.setItem('registeredUsers', JSON)
    ↓
Muestra mensaje de éxito
    ↓
Cambia a modo login
```

### 2. Flujo de Login

```
Usuario ingresa credenciales
    ↓
Login.jsx → handleSubmit()
    ↓
verifyUser(email, password) → userStorage.js
    ↓
findUserByEmail(email)
    ↓
Compara contraseñas
    ↓
login(user) → authContext.jsx
    ↓
localStorage.setItem('activeSession', 'true')
localStorage.setItem('currentUser', JSON)
    ↓
navigate('/productos')
    ↓
Productos.jsx se renderiza
```

### 3. Flujo de Cierre de Sesión

```
Usuario hace clic en "Cerrar Sesión"
    ↓
Productos.jsx → handleLogout()
    ↓
Muestra modal de confirmación
    ↓
Usuario confirma
    ↓
confirmLogout()
    ↓
logout() → authContext.jsx
    ↓
localStorage.removeItem('activeSession')
localStorage.removeItem('currentUser')
    ↓
alert('Sesión cerrada')
    ↓
navigate('/login')
```

---

## 🧩 Componentes Detallados

### 1. App.jsx

**Propósito**: Componente raíz que configura el enrutamiento y el contexto de autenticación.

**Funcionalidad**:
- Configura React Router
- Envuelve la app con `AuthProvider`
- Define rutas protegidas
- Redirige rutas no definidas

**Código clave**:
```javascript
<AuthProvider>              // Proporciona contexto de auth
  <Router>                   // Habilita navegación
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/productos" element={
        <ProtectedRoute>     // Protege la ruta
          <Productos />
        </ProtectedRoute>
      } />
    </Routes>
  </Router>
</AuthProvider>
```

**Modificaciones comunes**:
- Agregar nuevas rutas
- Cambiar rutas por defecto
- Agregar layout compartido

---

### 2. Login.jsx

**Propósito**: Maneja el registro e inicio de sesión de usuarios.

**Estados**:
- `isLogin`: Boolean - Modo login o registro
- `formData`: Object - Datos del formulario
- `error`: String - Mensajes de error
- `success`: String - Mensajes de éxito

**Funciones principales**:
- `handleChange()`: Actualiza el estado del formulario
- `handleSubmit()`: Procesa login o registro
- `setIsLogin()`: Cambia entre modos

**Validaciones**:
```javascript
// Registro
- Campos completos
- Contraseñas coinciden
- Contraseña mínimo 6 caracteres
- Email no duplicado

// Login
- Campos completos
- Usuario existe
- Contraseña correcta
```

**Modificaciones comunes**:
- Agregar más campos al registro
- Cambiar validaciones
- Agregar recuperación de contraseña
- Integrar con API externa

---

### 3. Productos.jsx

**Propósito**: Muestra productos en un carrusel y maneja la sesión del usuario.

**Estados**:
- `currentIndex`: Number - Índice del producto actual
- `showLogoutConfirm`: Boolean - Mostrar modal de confirmación

**Funciones principales**:
- `nextProduct()`: Siguiente producto
- `prevProduct()`: Producto anterior
- `handleLogout()`: Muestra modal de confirmación
- `confirmLogout()`: Cierra sesión

**Datos de productos**:
```javascript
const productos = [
  {
    id: 1,
    nombre: 'Producto',
    precio: 99.99,
    imagen: 'URL',
    descripcion: 'Descripción'
  }
]
```

**Modificaciones comunes**:
- Agregar más productos
- Cambiar diseño del carrusel
- Agregar funcionalidad de compra
- Agregar filtros/búsqueda
- Cargar productos desde API

---

### 4. authContext.jsx

**Propósito**: Gestiona el estado global de autenticación usando Context API.

**Estado global**:
- `isAuthenticated`: Boolean
- `currentUser`: Object | null

**Funciones exportadas**:
- `login(user)`: Inicia sesión
- `logout()`: Cierra sesión
- `useAuth()`: Hook para acceder al contexto

**Persistencia**:
- Lee localStorage al cargar
- Guarda sesión en localStorage
- Elimina sesión al cerrar

**Uso en componentes**:
```javascript
const { isAuthenticated, currentUser, login, logout } = useAuth()
```

**Modificaciones comunes**:
- Agregar más datos al usuario
- Agregar roles/permissos
- Integrar con tokens JWT
- Agregar refresh automático

---

### 5. userStorage.js

**Propósito**: Funciones utilitarias para manejar usuarios en localStorage.

**Funciones**:

1. **`saveUser(userData)`**
   - Guarda un nuevo usuario
   - Verifica duplicados
   - Retorna true o lanza error

2. **`getUsers()`**
   - Retorna array de todos los usuarios
   - Retorna [] si no hay usuarios

3. **`findUserByEmail(email)`**
   - Busca usuario por email
   - Retorna usuario o undefined

4. **`verifyUser(email, password)`**
   - Verifica credenciales
   - Retorna `{ success: boolean, user/message }`

**Estructura de datos**:
```javascript
{
  id: Number,              // Timestamp único
  nombre: String,
  email: String,
  password: String,        // ⚠️ En texto plano (solo educativo)
  fechaRegistro: String    // ISO date string
}
```

**Modificaciones comunes**:
- Agregar más campos al usuario
- Encriptar contraseñas
- Agregar validaciones
- Migrar a base de datos

---

## 🔐 Sistema de Autenticación

### Cómo Funciona

1. **Registro**:
   - Usuario se registra → Se guarda en `registeredUsers`
   - No inicia sesión automáticamente

2. **Login**:
   - Verifica credenciales
   - Si es correcto → Guarda en `activeSession` y `currentUser`
   - Redirige a `/productos`

3. **Protección de Rutas**:
   - `ProtectedRoute` verifica `isAuthenticated`
   - Si no está autenticado → Redirige a `/login`

4. **Persistencia**:
   - Al recargar, lee `activeSession` y `currentUser`
   - Si existen → Restaura la sesión

### Claves de localStorage

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `registeredUsers` | Array | Todos los usuarios registrados |
| `activeSession` | String | `'true'` si hay sesión activa |
| `currentUser` | Object | Datos del usuario en sesión |

---

## 💾 Almacenamiento Local

### localStorage API

**Guardar datos**:
```javascript
localStorage.setItem('clave', 'valor')
// Para objetos:
localStorage.setItem('clave', JSON.stringify(objeto))
```

**Leer datos**:
```javascript
const valor = localStorage.getItem('clave')
// Para objetos:
const objeto = JSON.parse(localStorage.getItem('clave'))
```

**Eliminar datos**:
```javascript
localStorage.removeItem('clave')
```

**Limpiar todo**:
```javascript
localStorage.clear()
```

### Limitaciones

- **Tamaño**: ~5-10MB por dominio
- **Solo strings**: Debes usar JSON.stringify/parse
- **Sincrónico**: Bloquea el hilo principal
- **Mismo origen**: Solo accesible desde el mismo dominio

### Ver Datos en el Navegador

1. Abre DevTools (F12)
2. Application → Local Storage
3. Selecciona tu dominio
4. Verás todas las claves y valores

---

## 🛠️ Guía de Modificaciones

### 1. Agregar un Nuevo Campo al Registro

**Paso 1**: Modificar `Login.jsx`

```javascript
// En el estado inicial
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: ''  // ← Nuevo campo
})

// En el formulario (modo registro)
<div className="form-group">
  <label htmlFor="telefono">Teléfono</label>
  <input
    type="tel"
    id="telefono"
    name="telefono"
    value={formData.telefono}
    onChange={handleChange}
    placeholder="123-456-7890"
  />
</div>
```

**Paso 2**: Guardar el campo en `userStorage.js`

El campo se guarda automáticamente porque usamos `userData` completo.

---

### 2. Cambiar los Productos del Carrusel

**Modificar `Productos.jsx`**:

```javascript
const productos = [
  {
    id: 1,
    nombre: 'Tu Producto',
    precio: 99.99,
    imagen: 'https://tu-imagen.com/producto.jpg',
    descripcion: 'Descripción del producto'
  },
  // Agregar más productos...
]
```

---

### 3. Agregar una Nueva Ruta

**Paso 1**: Crear el componente

```javascript
// src/components/NuevaPagina.jsx
function NuevaPagina() {
  return <div>Contenido de la nueva página</div>
}
export default NuevaPagina
```

**Paso 2**: Agregar la ruta en `App.jsx`

```javascript
import NuevaPagina from './components/NuevaPagina'

// En el Router
<Route path="/nueva-pagina" element={<NuevaPagina />} />
```

---

### 4. Cambiar los Colores del Tema

**Modificar los archivos CSS**:

```css
/* En Login.css o Productos.css */
/* Cambiar el gradiente */
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);

/* Cambiar color de botones */
background: #TU_COLOR;
```

**Colores actuales**:
- Primario: `#667eea` (azul/morado)
- Secundario: `#764ba2` (morado oscuro)

---

### 5. Agregar Validación de Email Más Estricta

**Modificar `Login.jsx`**:

```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// En handleSubmit (registro)
if (!validateEmail(formData.email)) {
  setError('Email inválido')
  return
}
```

---

### 6. Agregar Contraseña Mínima Más Segura

**Modificar `Login.jsx`**:

```javascript
// En handleSubmit (registro)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
if (!passwordRegex.test(formData.password)) {
  setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número')
  return
}
```

---

### 7. Agregar Funcionalidad de "Recordar Usuario"

**Modificar `Login.jsx`**:

```javascript
// Agregar estado
const [rememberMe, setRememberMe] = useState(false)

// En el formulario
<label>
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  Recordarme
</label>

// Al hacer login
if (rememberMe) {
  localStorage.setItem('rememberedEmail', formData.email)
}
```

---

### 8. Agregar Búsqueda de Productos

**Modificar `Productos.jsx`**:

```javascript
// Agregar estado
const [searchTerm, setSearchTerm] = useState('')

// Filtrar productos
const filteredProducts = productos.filter(producto =>
  producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
)

// En el JSX
<input
  type="text"
  placeholder="Buscar productos..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Agregar Campo "Edad" al Registro

```javascript
// 1. En Login.jsx - Estado
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  edad: ''  // ← Nuevo
})

// 2. En Login.jsx - Input
{!isLogin && (
  <div className="form-group">
    <label htmlFor="edad">Edad</label>
    <input
      type="number"
      id="edad"
      name="edad"
      value={formData.edad}
      onChange={handleChange}
      min="18"
      max="100"
    />
  </div>
)}

// 3. Validación
if (!isLogin && (!formData.edad || formData.edad < 18)) {
  setError('Debes ser mayor de 18 años')
  return
}
```

---

### Ejemplo 2: Mostrar Lista de Usuarios Registrados

```javascript
// Crear componente src/components/ListaUsuarios.jsx
import { getUsers } from '../utils/userStorage'

function ListaUsuarios() {
  const usuarios = getUsers()
  
  return (
    <div>
      <h2>Usuarios Registrados: {usuarios.length}</h2>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>
            {user.nombre} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### Ejemplo 3: Agregar Botón "Olvidé mi Contraseña"

```javascript
// En Login.jsx
const handleForgotPassword = () => {
  if (!formData.email) {
    setError('Ingresa tu email primero')
    return
  }
  
  const user = findUserByEmail(formData.email)
  if (user) {
    alert(`Tu contraseña es: ${user.password}`) // ⚠️ Solo educativo
  } else {
    setError('Email no encontrado')
  }
}

// En el JSX (dentro del formulario de login)
{isLogin && (
  <button
    type="button"
    onClick={handleForgotPassword}
    className="forgot-password-button"
  >
    ¿Olvidaste tu contraseña?
  </button>
)}
```

---

### Ejemplo 4: Agregar Contador de Visitas

```javascript
// En Productos.jsx
useEffect(() => {
  const visits = parseInt(localStorage.getItem('visits') || '0')
  localStorage.setItem('visits', (visits + 1).toString())
}, [])

// Mostrar en el header
const visits = localStorage.getItem('visits')
<p>Visitas: {visits}</p>
```

---

## 🔍 Debugging y Troubleshooting

### Ver Datos en Consola

```javascript
// En cualquier componente
import { getUsers } from '../utils/userStorage'

console.log('Usuarios:', getUsers())
console.log('Sesión:', localStorage.getItem('activeSession'))
console.log('Usuario actual:', localStorage.getItem('currentUser'))
```

### Limpiar Todo el Almacenamiento

```javascript
// En la consola del navegador
localStorage.clear()
// O específico
localStorage.removeItem('registeredUsers')
localStorage.removeItem('activeSession')
localStorage.removeItem('currentUser')
```

### Ver Errores de React

1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Los errores aparecerán en rojo
4. Haz clic para ver detalles

---

## 📝 Buenas Prácticas

1. **Validación**: Siempre valida datos del usuario
2. **Mensajes de Error**: Sé claro y específico
3. **UX**: Proporciona feedback visual (loading, success, error)
4. **Código Limpio**: Comenta código complejo
5. **Nombres Descriptivos**: Usa nombres claros para variables/funciones
6. **Separación de Responsabilidades**: Lógica en utils, UI en components

---

## 🚀 Próximos Pasos Sugeridos

1. **Encriptar Contraseñas**: Usar bcrypt o similar
2. **Agregar API**: Conectar con backend real
3. **Mejorar UI**: Agregar animaciones, transiciones
4. **Agregar Tests**: Jest + React Testing Library
5. **Agregar TypeScript**: Para mayor seguridad de tipos
6. **Agregar PWA**: Hacer la app instalable
7. **Agregar Internacionalización**: Soporte multi-idioma

---

## 📞 Recursos Adicionales

- [Documentación de React](https://react.dev)
- [React Router](https://reactrouter.com)
- [localStorage API](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [Context API](https://react.dev/reference/react/createContext)

---

**¡Feliz codificación! 🎉**

