# 📱 Manual de Uso - Proyecto Lina y Lookism Mobile

Este documento proporciona instrucciones detalladas para instalar, configurar y ejecutar tanto la aplicación móvil (**Lookism Mobile**) como la aplicación web (**Proyecto Lina**).

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

1.  **Node.js** (versión LTS recomendada): [Descargar aquí](https://nodejs.org/)
2.  **Git** (opcional, pero recomendado): [Descargar aquí](https://git-scm.com/)
3.  **Expo Go** application en tu celular (para probar la app móvil):
    -   [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
    -   [iOS (App Store)](https://apps.apple.com/us/app/expo-go/id982107779)

---

## 📱 1. Aplicación Móvil (Lookism Mobile)

Esta es la aplicación principal para dispositivos móviles, construida con React Native y Expo.

### 📍 Ubicación
Carpeta: `lookism-mobile`

### 🛠️ Instalación

1.  Abre una terminal (PowerShell, CMD o Terminal).
2.  Navega a la carpeta del proyecto móvil:
    ```bash
    cd "lookism-mobile"
    ```
    *(Ajusta la ruta si es necesario, ej: `cd "C:\Users\ASUS\Downloads\proyecto lina\lookism-mobile"`)*

3.  Instala las dependencias:
    ```bash
    npm install
    ```
    *Esto puede tardar unos minutos.*

### ⚙️ Configuración (Firebase)

La aplicación utiliza Firebase para autenticación y base de datos.
1.  Abre el archivo: `lookism-mobile/src/config/firebaseConfig.js`.
2.  Verifica que la configuración (`firebaseConfig`) sea correcta. Si estás usando tu propio proyecto de Firebase, reemplaza los valores con los de tu consola de Firebase.

### ▶️ Ejecución

Para iniciar la aplicación:

1.  En la terminal (dentro de la carpeta `lookism-mobile`), ejecuta:
    ```bash
    npx expo start
    ```
    *O alternativamente: `npm start`*

2.  Verás un **código QR** en la terminal.
3.  **En tu celular**:
    -   Abre la app **Expo Go**.
    -   Escanear el código QR (o selecciona el proyecto si aparece listado).
    -   ¡La app cargará en tu teléfono!

**Solución de problemas comunes:**
-   Si la app no conecta, asegúrate de que tu celular y tu computadora estén en la **misma red Wi-Fi**.
-   Si tienes problemas, prueba presionando `s` en la terminal para cambiar a modo "Tunnel" (puede ser más lento pero salta restricciones de red).

---

## 💻 2. Aplicación Web (Proyecto Lina)

Esta es la versión web del proyecto, construida con React y Vite.

### 📍 Ubicación
Carpeta: Raíz del proyecto (`proyecto lina`)

### 🛠️ Instalación

1.  Abre una nueva terminal en la carpeta raíz del proyecto (`proyecto lina`).
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### ▶️ Ejecución

Para iniciar el servidor de desarrollo:

1.  Ejecuta el siguiente comando:
    ```bash
    npm run dev
    ```

2.  Verás una salida indicando que el servidor está corriendo (usualmente en el puerto 5173).
3.  Abre tu navegador web y visita:
    -   `http://localhost:5173`

### 📦 Construcción para Producción

Si deseas generar la versión final para subir a un hosting:
```bash
npm run build
```
Los archivos se generarán en la carpeta `dist`.

---

## 🆘 Solución de Problemas Generales

| Problema | Solución Posible |
| :--- | :--- |
| **"Command not found: npm"** | No tienes Node.js instalado o no está en el PATH. Instala Node.js. |
| **Error de permisos** | Ejecuta la terminal como Administrador (Windows) o usa `sudo` (Mac/Linux). |
| **Conflicto de puertos** | Si el puerto 5173 u 8081 está ocupado, cierra otros procesos de Node o deja que el comando elija otro puerto automáticamente. |
| **Expo: "Metro Bundler error"** | Presiona `Ctrl+C` para detener, y corre `npx expo start -c` para limpiar el caché. |

---

¡Disfruta desarrollando en Proyecto Lina! 🚀
