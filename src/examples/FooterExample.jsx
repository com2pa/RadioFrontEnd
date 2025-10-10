import React from 'react'
import { Box, Container, VStack, Text, Button } from '@chakra-ui/react'
import PublicFooter from '../components/layout/PublicFooter'
import PageWithFooter from '../components/layout/PageWithFooter'
import { getFooterConfig, footerPresets } from '../config/footerConfig'

/**
 * Ejemplos de uso del componente PublicFooter
 * Este archivo muestra diferentes formas de implementar el footer
 */

// Ejemplo 1: Uso básico con configuración por defecto
export const BasicFooterExample = () => {
  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página de Ejemplo
          </Text>
          <Text>
            Esta es una página de ejemplo que muestra el footer básico.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer básico - usa toda la configuración por defecto */}
      <PublicFooter />
    </Box>
  )
}

// Ejemplo 2: Footer con configuración personalizada
export const CustomFooterExample = () => {
  const customConfig = {
    companyInfo: {
      name: 'Mi Radio Personalizada',
      description: 'Una estación de radio única con programación especializada.',
      founded: '2018'
    },
    contactInfo: {
      email: 'info@miradio.com',
      phone: '+1 (555) 999-8888',
      address: '456 Music Avenue, Ciudad, País'
    },
    socialMedia: {
      facebook: 'https://facebook.com/miradio',
      instagram: 'https://instagram.com/miradio'
    },
    settings: {
      showNewsletter: false,
      logoText: 'Mi Radio'
    }
  }

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página con Footer Personalizado
          </Text>
          <Text>
            Esta página muestra cómo personalizar el footer con información específica.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer personalizado */}
      <PublicFooter {...getFooterConfig(customConfig)} />
    </Box>
  )
}

// Ejemplo 3: Footer minimalista
export const MinimalFooterExample = () => {
  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página Simple
          </Text>
          <Text>
            Esta página usa un footer minimalista con menos información.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer minimalista */}
      <PublicFooter {...footerPresets.minimal} />
    </Box>
  )
}

// Ejemplo 4: Footer con color personalizado
export const ColoredFooterExample = () => {
  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página con Footer de Color
          </Text>
          <Text>
            Esta página muestra el footer con un color de fondo personalizado.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer con color personalizado */}
      <PublicFooter 
        bgColor="blue.900"
        logoText="Radio Azul"
      />
    </Box>
  )
}

// Ejemplo 5: Footer para página de contacto
export const ContactPageFooterExample = () => {
  const contactConfig = {
    settings: {
      showContactInfo: true,
      showSocialMedia: true,
      showNewsletter: false
    },
    contactInfo: {
      email: 'contacto@radiofm.com',
      phone: '+1 (555) 123-4567',
      address: '123 Radio Street, Ciudad, País',
      businessHours: 'Lunes a Viernes: 8:00 AM - 6:00 PM'
    }
  }

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página de Contacto
          </Text>
          <Text>
            Esta página enfatiza la información de contacto en el footer.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer optimizado para contacto */}
      <PublicFooter {...getFooterConfig(contactConfig)} />
    </Box>
  )
}

// Ejemplo 6: Footer con enlaces personalizados
export const CustomLinksFooterExample = () => {
  const customLinksConfig = {
    quickLinks: [
      { label: 'Inicio', href: '/' },
      { label: 'Programas', href: '/programas' },
      { label: 'Noticias', href: '/noticias' },
      { label: 'Eventos', href: '/eventos' },
      { label: 'Galería', href: '/galeria' }
    ],
    services: [
      { label: 'Streaming HD', href: '/streaming' },
      { label: 'Podcasts Premium', href: '/podcasts-premium' },
      { label: 'Noticias 24/7', href: '/noticias-24' },
      { label: 'Publicidad', href: '/publicidad' },
      { label: 'Eventos en Vivo', href: '/eventos-vivo' }
    ],
    legalLinks: [
      { label: 'Términos de Uso', href: '/terminos' },
      { label: 'Política de Privacidad', href: '/privacidad' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Aviso Legal', href: '/aviso-legal' },
      { label: 'DMCA', href: '/dmca' },
      { label: 'Accesibilidad', href: '/accesibilidad' }
    ]
  }

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página con Enlaces Personalizados
          </Text>
          <Text>
            Esta página muestra el footer con enlaces completamente personalizados.
          </Text>
        </VStack>
      </Container>
      
      {/* Footer con enlaces personalizados */}
      <PublicFooter {...getFooterConfig(customLinksConfig)} />
    </Box>
  )
}

// Ejemplo 7: Footer siempre en la parte inferior (Sticky Footer)
export const StickyFooterExample = () => {
  return (
    <PageWithFooter>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Página con Footer Siempre Abajo
          </Text>
          <Text>
            Esta página usa PageWithFooter para que el footer siempre esté en la parte inferior,
            incluso cuando hay poco contenido.
          </Text>
          <Text>
            Prueba a reducir la altura de la ventana para ver cómo se mantiene el footer abajo.
          </Text>
        </VStack>
      </Container>
    </PageWithFooter>
  )
}

// Componente principal que muestra todos los ejemplos
const FooterExamples = () => {
  return (
    <VStack spacing={16} py={8}>
      <Text fontSize="3xl" fontWeight="bold" textAlign="center">
        Ejemplos de PublicFooter
      </Text>
      
      <BasicFooterExample />
      <CustomFooterExample />
      <MinimalFooterExample />
      <ColoredFooterExample />
      <ContactPageFooterExample />
      <CustomLinksFooterExample />
      <StickyFooterExample />
    </VStack>
  )
}

export default FooterExamples
