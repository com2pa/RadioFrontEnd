# PublicFooter Component

Componente reutilizable para el footer de páginas públicas de Radio FM.

## Características

- ✅ **Completamente reutilizable** - Se puede usar en cualquier página pública
- ✅ **Altamente configurable** - Props para personalizar cada sección
- ✅ **Responsive** - Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible** - Incluye enlaces y navegación accesible
- ✅ **Tema adaptable** - Soporte para modo claro/oscuro
- ✅ **Configuración centralizada** - Usa `footerConfig.js` para datos

## Uso Básico

### Opción 1: Footer Normal
```jsx
import PublicFooter from '../../components/layout/PublicFooter'

const MyPage = () => {
  return (
    <div>
      {/* Contenido de tu página */}
      
      <PublicFooter />
    </div>
  )
}
```

### Opción 2: Footer Siempre en la Parte Inferior (Recomendado)
```jsx
import PageWithFooter from '../../components/layout/PageWithFooter'

const MyPage = () => {
  return (
    <PageWithFooter>
      {/* Contenido de tu página */}
    </PageWithFooter>
  )
}
```

## Uso con Configuración Personalizada

### Con Footer Normal
```jsx
import PublicFooter from '../../components/layout/PublicFooter'
import { getFooterConfig } from '../../config/footerConfig'

const MyPage = () => {
  const customConfig = {
    companyInfo: {
      name: 'Mi Radio',
      description: 'Descripción personalizada'
    },
    contactInfo: {
      email: 'mi-email@ejemplo.com',
      phone: '+1 (555) 999-8888'
    }
  }

  return (
    <div>
      {/* Contenido de tu página */}
      
      <PublicFooter {...getFooterConfig(customConfig)} />
    </div>
  )
}
```

### Con Footer Siempre Abajo
```jsx
import PageWithFooter from '../../components/layout/PageWithFooter'
import { getFooterConfig } from '../../config/footerConfig'

const MyPage = () => {
  const customConfig = {
    companyInfo: {
      name: 'Mi Radio',
      description: 'Descripción personalizada'
    },
    contactInfo: {
      email: 'mi-email@ejemplo.com',
      phone: '+1 (555) 999-8888'
    }
  }

  return (
    <PageWithFooter footerProps={getFooterConfig(customConfig)}>
      {/* Contenido de tu página */}
    </PageWithFooter>
  )
}
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `companyInfo` | `Object` | ❌ | Información de la empresa |
| `quickLinks` | `Array` | ❌ | Enlaces rápidos |
| `services` | `Array` | ❌ | Servicios ofrecidos |
| `legalLinks` | `Array` | ❌ | Enlaces legales |
| `socialMedia` | `Object` | ❌ | Redes sociales |
| `contactInfo` | `Object` | ❌ | Información de contacto |
| `bgColor` | `string` | ❌ | Color de fondo personalizado |
| `showNewsletter` | `boolean` | ❌ | Mostrar sección newsletter (default: true) |
| `showSocialMedia` | `boolean` | ❌ | Mostrar redes sociales (default: true) |
| `showContactInfo` | `boolean` | ❌ | Mostrar información contacto (default: true) |
| `logo` | `string` | ❌ | URL del logo personalizado |
| `logoText` | `string` | ❌ | Texto del logo (default: 'Radio FM') |

## PageWithFooter Component

Componente wrapper que asegura que el footer siempre esté en la parte inferior de la página.

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `children` | `React.ReactNode` | ✅ | Contenido de la página |
| `footerProps` | `Object` | ❌ | Props para el componente PublicFooter |
| `minHeight` | `string` | ❌ | Altura mínima de la página (default: '100vh') |

## Estructura de Datos

### companyInfo
```javascript
{
  name: 'Radio FM',
  description: 'Descripción de la empresa',
  founded: '2020',
  slogan: 'Slogan opcional'
}
```

### quickLinks / services / legalLinks
```javascript
[
  { label: 'Inicio', href: '/' },
  { label: 'Contacto', href: '/contacto' }
]
```

### socialMedia
```javascript
{
  facebook: 'https://facebook.com/radiofm',
  twitter: 'https://twitter.com/radiofm',
  instagram: 'https://instagram.com/radiofm',
  youtube: 'https://youtube.com/radiofm'
}
```

### contactInfo
```javascript
{
  email: 'contacto@radiofm.com',
  phone: '+1 (555) 123-4567',
  address: '123 Radio Street, Ciudad, País',
  businessHours: 'Lunes a Viernes: 8:00 AM - 6:00 PM'
}
```

## Presets Disponibles

### Footer Básico
```jsx
import { footerPresets } from '../../config/footerConfig'

<PublicFooter {...footerPresets.basic} />
```

### Footer Completo
```jsx
<PublicFooter {...footerPresets.full} />
```

### Footer Minimalista
```jsx
<PublicFooter {...footerPresets.minimal} />
```

## Personalización Avanzada

### Cambiar Color de Fondo
```jsx
<PublicFooter bgColor="blue.900" />
```

### Ocultar Secciones
```jsx
<PublicFooter 
  showNewsletter={false}
  showSocialMedia={false}
  showContactInfo={false}
/>
```

### Logo Personalizado
```jsx
<PublicFooter 
  logo="/path/to/logo.png"
  logoText="Mi Radio Personalizada"
/>
```

### Enlaces Personalizados
```jsx
<PublicFooter 
  quickLinks={[
    { label: 'Mi Página', href: '/mi-pagina' },
    { label: 'Mi Blog', href: '/blog' }
  ]}
  services={[
    { label: 'Mi Servicio', href: '/servicio' }
  ]}
/>
```

## Configuración Global

Para cambiar la configuración global del footer, edita `src/config/footerConfig.js`:

```javascript
// Actualizar información de contacto
import { updateContactInfo } from '../../config/footerConfig'

updateContactInfo({
  email: 'nuevo-email@ejemplo.com',
  phone: '+1 (555) 999-8888'
})

// Añadir nuevo enlace
import { addFooterLink } from '../../config/footerConfig'

addFooterLink('quickLinks', {
  label: 'Nuevo Enlace',
  href: '/nuevo-enlace'
})
```

## Estructura del Footer

El footer se divide en las siguientes secciones:

1. **Información de la Empresa**
   - Logo y nombre
   - Descripción
   - Información de contacto

2. **Enlaces Rápidos**
   - Navegación principal
   - Enlaces importantes

3. **Servicios**
   - Servicios ofrecidos
   - Enlaces a funcionalidades

4. **Redes Sociales y Newsletter**
   - Iconos de redes sociales
   - Sección de suscripción

5. **Footer Inferior**
   - Copyright
   - Enlaces legales
   - Información adicional

## Responsive Design

El footer se adapta automáticamente a diferentes tamaños de pantalla:

- **Mobile**: Una columna, elementos centrados
- **Tablet**: Dos columnas
- **Desktop**: Cuatro columnas

## Accesibilidad

- Enlaces con `aria-label` apropiados
- Contraste de colores adecuado
- Navegación por teclado
- Enlaces externos marcados correctamente

## Ejemplos de Uso

### Página Principal
```jsx
import PageWithFooter from '../../components/layout/PageWithFooter'
import { footerPresets } from '../../config/footerConfig'

const HomePage = () => {
  return (
    <PageWithFooter footerProps={footerPresets.full}>
      <main>
        {/* Contenido de la página principal */}
      </main>
    </PageWithFooter>
  )
}
```

### Página de Contacto
```jsx
import PageWithFooter from '../../components/layout/PageWithFooter'

const ContactPage = () => {
  return (
    <PageWithFooter 
      footerProps={{
        showContactInfo: true,
        showSocialMedia: true,
        showNewsletter: false
      }}
    >
      <main>
        {/* Formulario de contacto */}
      </main>
    </PageWithFooter>
  )
}
```

### Página Simple
```jsx
import PageWithFooter from '../../components/layout/PageWithFooter'
import { footerPresets } from '../../config/footerConfig'

const SimplePage = () => {
  return (
    <PageWithFooter footerProps={footerPresets.minimal}>
      <main>
        {/* Contenido simple */}
      </main>
    </PageWithFooter>
  )
}
```

## Mejores Prácticas

1. **Usa la configuración centralizada** para cambios globales
2. **Personaliza solo lo necesario** para cada página
3. **Mantén consistencia** en los enlaces y información
4. **Prueba en diferentes dispositivos** para asegurar responsividad
5. **Actualiza la información de contacto** regularmente

## Troubleshooting

### El footer no se muestra
- Verifica que el componente esté importado correctamente
- Asegúrate de que no haya errores de JavaScript en la consola

### Los enlaces no funcionan
- Verifica que las rutas estén correctas
- Asegúrate de que los enlaces externos tengan `isExternal`

### Problemas de estilo
- Verifica que Chakra UI esté configurado correctamente
- Revisa que no haya conflictos de CSS

## Contribuir

Para añadir nuevas funcionalidades al footer:

1. Actualiza el componente `PublicFooter.jsx`
2. Añade la configuración en `footerConfig.js`
3. Actualiza esta documentación
4. Prueba en diferentes páginas y dispositivos
