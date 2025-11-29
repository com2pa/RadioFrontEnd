# Radio Frontend - Radio Oxígeno 88.1 FM

Aplicación web moderna para Radio Oxígeno 88.1 FM construida con React, Vite y Chakra UI.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📺 Streaming en Vivo

El proyecto incluye un servidor de streaming local para transmitir desde OBS Studio.

### Configuración Rápida

1. **Instalar dependencias del servidor:**
   ```bash
   npm run stream:install
   ```

2. **Verificar FFmpeg:**
   ```bash
   npm run stream:check
   ```

3. **Iniciar el servidor de streaming:**
   ```bash
   npm run stream:start
   ```

4. **Configurar OBS Studio:**
   - Servicio: Personalizado
   - Servidor: `rtmp://localhost:1935/live`
   - Clave: `stream`

5. **Configurar la aplicación:**
   - Crea un archivo `.env` en la raíz:
     ```env
     VITE_STREAM_URL=http://localhost:8000/live/stream.m3u8
     ```

### Documentación Completa

- 📚 [Guía Completa de Streaming Local](./docs/LOCAL_STREAMING_SETUP.md)
- 📖 [Configuración de OBS Studio](./docs/OBS_STUDIO_SETUP.md)
- 🔧 [README del Servidor](./server/README.md)

## 📁 Estructura del Proyecto

```
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas de la aplicación
│   ├── router/            # Configuración de rutas
│   ├── config/            # Archivos de configuración
│   └── ...
├── server/                # Servidor de streaming local
│   ├── streaming-server.js
│   ├── package.json
│   └── README.md
├── docs/                   # Documentación
└── ...
```

## 🛠️ Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

### Streaming
- `npm run stream:install` - Instala dependencias del servidor
- `npm run stream:start` - Inicia el servidor de streaming
- `npm run stream:dev` - Inicia el servidor en modo desarrollo (con watch)
- `npm run stream:check` - Verifica la instalación de FFmpeg

## 🔧 Tecnologías

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Chakra UI** - Sistema de diseño
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Node Media Server** - Servidor de streaming RTMP/HLS

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL del stream de transmisión en vivo
VITE_STREAM_URL=http://localhost:8000/live/stream.m3u8
```

## 📚 Documentación

- [Guía de Streaming Local](./docs/LOCAL_STREAMING_SETUP.md)
- [Configuración de OBS Studio](./docs/OBS_STUDIO_SETUP.md)
- [README del Servidor](./server/README.md)

## 🆘 Soporte

Si encuentras problemas:
1. Revisa la documentación en `docs/`
2. Verifica que todos los requisitos estén instalados
3. Consulta los logs del servidor de streaming

## 📄 Licencia

MIT
