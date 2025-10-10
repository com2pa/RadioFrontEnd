import React from 'react'
import { Box } from '@chakra-ui/react'
import PublicMenu from './PublicMenu'

/**
 * Layout wrapper para páginas públicas que incluye el menú de navegación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 */
const PublicLayout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Menú de navegación pública */}
      <PublicMenu />
      
      {/* Contenido principal */}
      <Box flex="1">
        {children}
      </Box>
    </Box>
  )
}

export default PublicLayout
