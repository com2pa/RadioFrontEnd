import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Link,
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  Icon,
  Image,
  Badge
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube,
  FiHeart,
  FiRadio
} from 'react-icons/fi'

/**
 * Componente Footer reutilizable para páginas públicas
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.companyInfo - Información de la empresa
 * @param {Array} props.quickLinks - Enlaces rápidos
 * @param {Array} props.services - Servicios ofrecidos
 * @param {Array} props.legalLinks - Enlaces legales
 * @param {Object} props.socialMedia - Redes sociales
 * @param {Object} props.contactInfo - Información de contacto
 * @param {string} props.bgColor - Color de fondo personalizado
 * @param {boolean} props.showNewsletter - Mostrar sección de newsletter
 * @param {boolean} props.showSocialMedia - Mostrar redes sociales
 * @param {boolean} props.showContactInfo - Mostrar información de contacto
 * @param {string} props.logo - URL del logo
 * @param {string} props.logoText - Texto del logo
 */
const PublicFooter = ({
  companyInfo = {
    name: 'Radio FM',
    description: 'Tu estación de radio favorita con la mejor música y noticias',
    founded: '2020'
  },
  quickLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Programas', href: '/programas' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Contacto', href: '/contacto' }
  ],
  services = [
    { label: 'Streaming en Vivo', href: '/streaming' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Publicidad', href: '/publicidad' }
  ],
  legalLinks = [
    { label: 'Términos y Condiciones', href: '/terms' },
    { label: 'Política de Privacidad', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Aviso Legal', href: '/legal' }
  ],
  socialMedia = {
    facebook: 'https://facebook.com/radiofm',
    twitter: 'https://twitter.com/radiofm',
    instagram: 'https://instagram.com/radiofm',
    youtube: 'https://youtube.com/radiofm'
  },
  contactInfo = {
    email: 'contacto@radiofm.com',
    phone: '+1 (555) 123-4567',
    address: '123 Radio Street, Ciudad, País'
  },
  bgColor,
  showNewsletter = true,
  showSocialMedia = true,
  showContactInfo = true,
  logo,
  logoText = 'Radio FM',
  ...props
}) => {
  const footerBg = useColorModeValue('gray.900', 'gray.800')
  const textColor = useColorModeValue('gray.300', 'gray.400')
  const headingColor = useColorModeValue('white', 'gray.100')
  const linkColor = useColorModeValue('gray.300', 'gray.400')
  const linkHoverColor = useColorModeValue('white', 'gray.100')
  const dividerColor = useColorModeValue('gray.700', 'gray.600')

  const currentYear = new Date().getFullYear()

  return (
    <Box 
      as="footer" 
      bg={bgColor || footerBg} 
      color={textColor}
      mt="auto"
      {...props}
    >
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Sección principal del footer */}
          <Grid 
            templateColumns={{ 
              base: '1fr', 
              md: 'repeat(2, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }} 
            gap={8}
          >
            {/* Información de la empresa */}
            <GridItem>
              <VStack align="start" spacing={4}>
                <HStack spacing={3}>
                  {logo ? (
                    <Image 
                      src={logo} 
                      alt={companyInfo.name}
                      boxSize="40px"
                      objectFit="contain"
                    />
                  ) : (
                    <Icon as={FiRadio} boxSize={8} color="blue.400" />
                  )}
                  <Text 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color={headingColor}
                  >
                    {logoText}
                  </Text>
                </HStack>
                
                <Text fontSize="sm" lineHeight="1.6">
                  {companyInfo.description}
                </Text>
                
                {showContactInfo && (
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Icon as={FiMail} boxSize={4} />
                      <Link 
                        href={`mailto:${contactInfo.email}`}
                        color={linkColor}
                        _hover={{ color: linkHoverColor }}
                        fontSize="sm"
                      >
                        {contactInfo.email}
                      </Link>
                    </HStack>
                    
                    <HStack spacing={2}>
                      <Icon as={FiPhone} boxSize={4} />
                      <Link 
                        href={`tel:${contactInfo.phone}`}
                        color={linkColor}
                        _hover={{ color: linkHoverColor }}
                        fontSize="sm"
                      >
                        {contactInfo.phone}
                      </Link>
                    </HStack>
                    
                    <HStack spacing={2} align="start">
                      <Icon as={FiMapPin} boxSize={4} mt={0.5} />
                      <Text fontSize="sm" lineHeight="1.4">
                        {contactInfo.address}
                      </Text>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </GridItem>

            {/* Enlaces rápidos */}
            <GridItem>
              <VStack align="start" spacing={4}>
                <Text 
                  fontSize="lg" 
                  fontWeight="semibold" 
                  color={headingColor}
                >
                  Enlaces Rápidos
                </Text>
                <VStack align="start" spacing={2}>
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      as={RouterLink}
                      to={link.href}
                      color={linkColor}
                      _hover={{ 
                        color: linkHoverColor,
                        textDecoration: 'underline'
                      }}
                      fontSize="sm"
                      transition="color 0.2s"
                    >
                      {link.label}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </GridItem>

            {/* Servicios */}
            <GridItem>
              <VStack align="start" spacing={4}>
                <Text 
                  fontSize="lg" 
                  fontWeight="semibold" 
                  color={headingColor}
                >
                  Servicios
                </Text>
                <VStack align="start" spacing={2}>
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      as={RouterLink}
                      to={service.href}
                      color={linkColor}
                      _hover={{ 
                        color: linkHoverColor,
                        textDecoration: 'underline'
                      }}
                      fontSize="sm"
                      transition="color 0.2s"
                    >
                      {service.label}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </GridItem>

            {/* Redes sociales y newsletter */}
            <GridItem>
              <VStack align="start" spacing={4}>
                {showSocialMedia && (
                  <>
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={headingColor}
                    >
                      Síguenos
                    </Text>
                    <HStack spacing={4}>
                      {socialMedia.facebook && (
                        <Link
                          href={socialMedia.facebook}
                          isExternal
                          color={linkColor}
                          _hover={{ color: linkHoverColor }}
                          transition="color 0.2s"
                        >
                          <Icon as={FiFacebook} boxSize={6} />
                        </Link>
                      )}
                      {socialMedia.twitter && (
                        <Link
                          href={socialMedia.twitter}
                          isExternal
                          color={linkColor}
                          _hover={{ color: linkHoverColor }}
                          transition="color 0.2s"
                        >
                          <Icon as={FiTwitter} boxSize={6} />
                        </Link>
                      )}
                      {socialMedia.instagram && (
                        <Link
                          href={socialMedia.instagram}
                          isExternal
                          color={linkColor}
                          _hover={{ color: linkHoverColor }}
                          transition="color 0.2s"
                        >
                          <Icon as={FiInstagram} boxSize={6} />
                        </Link>
                      )}
                      {socialMedia.youtube && (
                        <Link
                          href={socialMedia.youtube}
                          isExternal
                          color={linkColor}
                          _hover={{ color: linkHoverColor }}
                          transition="color 0.2s"
                        >
                          <Icon as={FiYoutube} boxSize={6} />
                        </Link>
                      )}
                    </HStack>
                  </>
                )}

                {showNewsletter && (
                  <VStack align="start" spacing={3}>
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      color={headingColor}
                    >
                      Newsletter
                    </Text>
                    <Text fontSize="sm">
                      Suscríbete para recibir las últimas noticias y programas
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      Próximamente
                    </Badge>
                  </VStack>
                )}
              </VStack>
            </GridItem>
          </Grid>

          <Divider borderColor={dividerColor} />

          {/* Footer inferior */}
          <Grid 
            templateColumns={{ 
              base: '1fr', 
              md: 'repeat(2, 1fr)' 
            }} 
            gap={4}
            alignItems="center"
          >
            <GridItem>
              <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                <Text fontSize="sm">
                  © {currentYear} {companyInfo.name}. Todos los derechos reservados.
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Fundada en {companyInfo.founded}
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align={{ base: 'center', md: 'end' }} spacing={2}>
                <HStack spacing={4} wrap="wrap" justify={{ base: 'center', md: 'end' }}>
                  {legalLinks.map((link, index) => (
                    <Link
                      key={index}
                      as={RouterLink}
                      to={link.href}
                      color={linkColor}
                      _hover={{ 
                        color: linkHoverColor,
                        textDecoration: 'underline'
                      }}
                      fontSize="xs"
                      transition="color 0.2s"
                    >
                      {link.label}
                    </Link>
                  ))}
                </HStack>
                <HStack spacing={1}>
                  <Text fontSize="xs" color={textColor}>
                    Hecho con
                  </Text>
                  <Icon as={FiHeart} color="red.400" boxSize={3} />
                  <Text fontSize="xs" color={textColor}>
                    para la comunidad
                  </Text>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

export default PublicFooter
