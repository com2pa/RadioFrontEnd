import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import PublicFooter from './PublicFooter'

/**
 * Componente wrapper que asegura que el footer siempre esté en la parte inferior
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 * @param {Object} props.footerProps - Props para el componente PublicFooter
 * @param {string} props.minHeight - Altura mínima de la página (default: '100vh')
 */
const PageWithFooter = ({ 
  children, 
  footerProps = {}, 
  minHeight = '100vh',
  ...props 
}) => {
  return (
    <Box 
      minH={minHeight}
      display="flex"
      flexDirection="column"
      {...props}
    >
      {/* Contenido principal que se expande */}
      <Box flex="1">
        {children}
      </Box>
      
      {/* Footer que siempre está en la parte inferior */}
      <PublicFooter {...footerProps} />
    </Box>
  )
}

export default PageWithFooter
