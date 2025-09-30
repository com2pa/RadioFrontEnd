# Menú Dinámico con Chakra UI

Este menú está diseñado para obtener sus opciones dinámicamente desde el backend a través de la API `/api/menu/main`.

## 🚀 Características

- ✅ **Datos Dinámicos**: Obtiene el menú desde el backend
- ✅ **Fallback**: Menú por defecto en caso de error
- ✅ **Estados de Carga**: Indicadores de loading y error
- ✅ **Responsive**: Funciona en desktop y móvil
- ✅ **Ordenamiento**: Soporte para orden personalizado
- ✅ **Filtrado**: Solo muestra items activos

## 📁 Estructura

```
src/
├── components/menu/
│   ├── DesktopNav.jsx      # Navegación desktop
│   ├── DesktopSubNav.jsx   # Subnavegación desktop
│   ├── MobileNav.jsx       # Navegación móvil
│   ├── MobileNavItem.jsx   # Items móviles
│   └── types.js           # Configuración y tipos
├── services/
│   └── menuService.js      # Servicio de API
├── hooks/
│   └── useMenu.js         # Hook personalizado
└── layout/
    └── Menu.jsx           # Componente principal
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Estructura de Datos del Backend

El endpoint `/api/menu/main` debe devolver un array con la siguiente estructura:

```json
[
  {
    "id": "home",
    "label": "Inicio",
    "href": "/",
    "order": 1,
    "active": true
  },
  {
    "id": "programs",
    "label": "Programas",
    "order": 2,
    "children": [
      {
        "id": "morning-program",
        "label": "Programa Matutino",
        "subLabel": "De 6:00 AM a 12:00 PM",
        "href": "/programas/matutino",
        "order": 1
      }
    ]
  }
]
```

## 🎯 Uso

El menú se usa automáticamente en el layout principal. No requiere configuración adicional.

### Hook useMenu

```javascript
import { useMenu } from '../hooks/useMenu'

const { menuItems, loading, error, refetch } = useMenu()
```

## 🛠️ Personalización

### Modificar Items por Defecto

Edita `src/components/menu/types.js` para cambiar el menú de fallback.

### Cambiar Estilos

Los estilos se pueden personalizar en cada componente usando las props de Chakra UI.

### Agregar Nuevas Funcionalidades

1. Modifica `menuService.js` para agregar nuevos endpoints
2. Actualiza `useMenu.js` para manejar nuevos datos
3. Modifica los componentes según sea necesario

## 🔍 Debugging

- Revisa la consola del navegador para errores de API
- Verifica que la URL de la API sea correcta
- Asegúrate de que el backend esté funcionando
- El menú mostrará un fallback si hay errores de conexión


