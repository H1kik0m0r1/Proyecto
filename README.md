# Proyecto Lina - Sistema de Login y Productos

Sistema de autenticación y visualización de productos desarrollado en React. Los usuarios pueden registrarse, iniciar sesión y navegar por un carrusel de productos. Todo el almacenamiento se realiza en el navegador (localStorage) sin necesidad de base de datos.

## 🚀 Características

- ✅ Sistema de registro de usuarios
- ✅ Inicio de sesión con validación
- ✅ Almacenamiento local de usuarios (localStorage)
- ✅ Página de productos con carrusel interactivo
- ✅ Cierre de sesión con confirmación
- ✅ Protección de rutas
- ✅ Interfaz moderna y profesional

## 📋 Requisitos Previos

**Solo necesitas Node.js instalado.** React y todas las demás dependencias se instalan automáticamente.

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
  - Descarga la versión **LTS** (Long Term Support)
  - Al instalar Node.js, npm se instala automáticamente

> 💡 **¿Primera vez?** Consulta [INSTRUCCIONES_INSTALACION.md](./INSTRUCCIONES_INSTALACION.md) para una guía paso a paso detallada.

## 🛠️ Instalación Rápida

1. **Instalar las dependencias** (esto descarga React y todo lo necesario):
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   - El proyecto se abrirá automáticamente en `http://localhost:5173`
   - Si no se abre automáticamente, navega a esa dirección

> ⚠️ **Importante:** No necesitas instalar React manualmente. Se instala automáticamente con `npm install`.

## 📁 Estructura del Proyecto

```
proyecto lina/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Componente de login/registro
│   │   ├── Login.css          # Estilos del login
│   │   ├── Productos.jsx      # Componente de productos con carrusel
│   │   └── Productos.css      # Estilos de productos
│   ├── utils/
│   │   ├── authContext.jsx    # Contexto de autenticación
│   │   └── userStorage.js     # Utilidades para almacenar usuarios
│   ├── App.jsx                # Componente principal con rutas
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── index.html                 # HTML principal
├── package.json               # Dependencias del proyecto
├── vite.config.js             # Configuración de Vite
└── README.md                  # Este archivo
```

## 🎯 Uso

### Registro de Usuario

1. Al abrir la aplicación, verás la pantalla de login
2. Haz clic en "Regístrate aquí" para crear una cuenta
3. Completa el formulario:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Haz clic en "Registrarse"
5. Una vez registrado, podrás iniciar sesión

### Iniciar Sesión

1. Ingresa tu correo electrónico y contraseña
2. Haz clic en "Iniciar Sesión"
3. Serás redirigido a la página de productos

### Navegar Productos

- Usa las flechas (‹ ›) para navegar entre productos
- Haz clic en los indicadores (puntos) para ir directamente a un producto
- Los productos se muestran en un carrusel interactivo

### Cerrar Sesión

1. Haz clic en el botón "Cerrar Sesión" en la parte superior
2. Se mostrará un modal de confirmación
3. Confirma para cerrar la sesión
4. Verás un mensaje de confirmación
5. Serás redirigido al login

## 💾 Almacenamiento

Los datos se guardan en el **localStorage** del navegador:

- **Usuarios registrados**: Se guardan en `registeredUsers`
- **Sesión activa**: Se guarda en `activeSession`
- **Usuario actual**: Se guarda en `currentUser`

**Nota**: Los datos se mantienen incluso después de cerrar el navegador, pero se eliminan si el usuario limpia el almacenamiento del navegador.

## 🎨 Personalización

### Cambiar Productos

Edita el array `productos` en `src/components/Productos.jsx`:

```javascript
const productos = [
  {
    id: 1,
    nombre: 'Tu Producto',
    precio: 99.99,
    imagen: 'URL_de_imagen',
    descripcion: 'Descripción del producto'
  },
  // ... más productos
]
```

### Cambiar Colores

Los colores principales están definidos en los archivos CSS usando gradientes. Puedes modificar:
- `src/components/Login.css` - Colores del login
- `src/components/Productos.css` - Colores de productos
- `src/index.css` - Fondo general

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
```

## 🔒 Seguridad

**Importante**: Este proyecto es educativo y utiliza almacenamiento local. Las contraseñas se guardan en texto plano. **NO uses este sistema en producción** sin implementar:

- Encriptación de contraseñas
- Autenticación con servidor
- Base de datos segura
- Tokens JWT
- HTTPS

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Elimina `node_modules` y ejecuta `npm install` nuevamente

### Los usuarios no se guardan
- Verifica que el navegador permita localStorage
- Abre las herramientas de desarrollador (F12) y revisa la consola

### Las imágenes no cargan
- Las imágenes usan URLs de Unsplash
- Si no hay internet, se mostrará una imagen placeholder

## 📝 Notas

- Los usuarios registrados persisten entre sesiones
- La sesión se mantiene activa hasta que el usuario cierre sesión
- Si limpias el localStorage del navegador, perderás todos los datos

## 👨‍💻 Desarrollo

Este proyecto fue creado con:
- **React 18**
- **Vite** (herramienta de build)
- **React Router** (navegación)
- **CSS puro** (sin frameworks)

---

¡Disfruta del proyecto! 🎉

