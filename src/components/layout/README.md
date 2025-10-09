# Componentes de Layout

## AdminMenu

Componente reutilizable para el menú del dashboard administrativo.

### Características

- ✅ **Reutilizable**: Se puede usar en todas las páginas del dashboard admin
- ✅ **Configurable**: Elementos del menú centralizados en `adminMenuConfig.js`
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible**: Incluye indicadores visuales de página activa
- ✅ **Extensible**: Fácil añadir nuevos elementos del menú

### Uso

```jsx
import AdminMenu from '../../components/layout/AdminMenu'

const MyAdminPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Box>
      {/* Botón para abrir el menú */}
      <IconButton 
        aria-label="Abrir menú" 
        icon={<FiMenu />} 
        onClick={onOpen} 
      />
      
      {/* Componente del menú */}
      <AdminMenu 
        isOpen={isOpen}
        onClose={onClose}
        currentPage="/dashboard/admin/mi-pagina"
      />
    </Box>
  )
}
```

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | `boolean` | ✅ | Estado de apertura del drawer |
| `onClose` | `function` | ✅ | Función para cerrar el drawer |
| `currentPage` | `string` | ❌ | Ruta actual para resaltar elemento activo |
| `showHeader` | `boolean` | ❌ | Mostrar header (default: true) |
| `showFooter` | `boolean` | ❌ | Mostrar footer (default: true) |
| `customItems` | `Array` | ❌ | Elementos adicionales del menú |
| `onLogout` | `function` | ❌ | Función personalizada para logout |

### Añadir nuevos elementos al menú

#### Opción 1: Modificar `adminMenuConfig.js`

```javascript
// src/config/adminMenuConfig.js
export const adminMenuItems = [
  // ... elementos existentes
  {
    id: 'nueva-funcionalidad',
    label: 'Nueva Funcionalidad',
    href: '/dashboard/admin/nueva-funcionalidad',
    icon: 'FiSettings',
    description: 'Descripción de la nueva funcionalidad'
  }
]
```

#### Opción 2: Añadir dinámicamente

```javascript
import { addMenuItem } from '../../config/adminMenuConfig'

// Añadir nuevo elemento
addMenuItem({
  id: 'nueva-funcionalidad',
  label: 'Nueva Funcionalidad',
  href: '/dashboard/admin/nueva-funcionalidad',
  icon: 'FiSettings',
  description: 'Descripción de la nueva funcionalidad'
})
```

#### Opción 3: Elementos personalizados por página

```jsx
const customItems = [
  {
    id: 'funcionalidad-especifica',
    label: 'Funcionalidad Específica',
    href: '/dashboard/admin/funcionalidad-especifica',
    icon: 'FiStar',
    description: 'Solo visible en esta página'
  }
]

<AdminMenu 
  isOpen={isOpen}
  onClose={onClose}
  currentPage="/dashboard/admin/mi-pagina"
  customItems={customItems}
/>
```

### Iconos disponibles

El componente soporta los siguientes iconos de React Icons:

- `FiMenu` - Menú
- `FiRadio` - Radio/Podcast
- `FiUsers` - Usuarios
- `FiShield` - Seguridad/Roles
- `FiSettings` - Configuración
- `FiHome` - Inicio
- `FiLogOut` - Cerrar sesión
- `FiArrowLeft` - Volver

### Mejores prácticas

1. **Centralización**: Siempre añade nuevos elementos en `adminMenuConfig.js`
2. **Consistencia**: Usa iconos coherentes con la funcionalidad
3. **Descripción**: Incluye descripciones claras para cada elemento
4. **IDs únicos**: Asegúrate de que cada elemento tenga un ID único
5. **Rutas consistentes**: Sigue el patrón `/dashboard/admin/[funcionalidad]`

### Migración de páginas existentes

Para migrar una página existente:

1. Importa el componente:
   ```jsx
   import AdminMenu from '../../components/layout/AdminMenu'
   ```

2. Elimina el array `menuItems` local

3. Reemplaza el `<Drawer>` manual con:
   ```jsx
   <AdminMenu 
     isOpen={isOpen}
     onClose={onClose}
     currentPage="/dashboard/admin/tu-pagina"
   />
   ```

4. Elimina las importaciones innecesarias de Drawer

### Ejemplo completo

```jsx
import React, { useState } from 'react'
import { Box, IconButton, useDisclosure } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import AdminMenu from '../../components/layout/AdminMenu'

const MiPaginaAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Box>
      <IconButton 
        aria-label="Abrir menú" 
        icon={<FiMenu />} 
        onClick={onOpen} 
      />
      
      <AdminMenu 
        isOpen={isOpen}
        onClose={onClose}
        currentPage="/dashboard/admin/mi-pagina"
      />
      
      {/* Contenido de tu página */}
    </Box>
  )
}

export default MiPaginaAdmin
```
