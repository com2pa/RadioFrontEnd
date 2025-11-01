import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Heading,
  IconButton,
  Button,
  Avatar,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Flex,
  Spinner,
  Icon
} from '@chakra-ui/react'
import { 
  FiMenu, 
  FiHome, 
  FiLogOut,
  FiRadio,
  FiVolume2,
  FiHeadphones,
  FiBookOpen,
  FiMusic,
  FiMic,
  FiCalendar,
  FiMail,
  FiInfo,
  FiSettings
} from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'

const UserLayout = ({ children, title, subtitle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { auth, logout } = useAuth()
  const user = auth
  const navigate = useNavigate()
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  
  // Estado para manejar el loading del logout
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Estado para el menú del usuario
  const [subscriberMenuItems, setSubscriberMenuItems] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const headerBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const logoColor = useColorModeValue('blue.600', 'blue.300')

  // Función para mapear iconos basándose en el título o tipo del menú
  const getIconByMenu = (title, menuType) => {
    const titleLower = title?.toLowerCase() || ''
    const typeLower = menuType?.toLowerCase() || ''
    
    // Mapeo de iconos por palabras clave
    if (titleLower.includes('inicio') || titleLower.includes('home')) return FiHome
    if (titleLower.includes('radio') || titleLower.includes('escuchar')) return FiRadio
    if (titleLower.includes('podcast')) return FiHeadphones
    if (titleLower.includes('noticia')) return FiBookOpen
    if (titleLower.includes('música') || titleLower.includes('music')) return FiMusic
    if (titleLower.includes('programa')) return FiMic
    if (titleLower.includes('evento')) return FiCalendar
    if (titleLower.includes('contacto')) return FiMail
    if (titleLower.includes('acerca') || titleLower.includes('about')) return FiInfo
    if (titleLower.includes('configuración') || titleLower.includes('settings')) return FiSettings
    
    // Mapeo por tipo de menú
    if (typeLower === 'radio') return FiRadio
    if (typeLower === 'podcast') return FiHeadphones
    if (typeLower === 'news') return FiBookOpen
    if (typeLower === 'music') return FiMusic
    if (typeLower === 'program') return FiMic
    if (typeLower === 'event') return FiCalendar
    
    // Icono por defecto
    return FiHome
  }

  // Cargar menú del usuario desde el API usando axios
  useEffect(() => {
    const fetchUserMenu = async () => {
      try {
        setLoadingMenu(true)
        
        // Obtener token de autenticación
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
        
        // Llamada al API usando axios
        const response = await axios.get('/api/menu/user-dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Adaptar la estructura del backend al formato esperado
        if (response.data && response.data.success && response.data.data) {
          // El backend ya devuelve solo items con menu_type = "user_dashboard"
          // Solo filtramos por is_active y ordenamos
          const userDashboardItems = response.data.data
            .filter(item => {
              // Solo filtrar por is_active
              const isActive = item.is_active === true || 
                              item.is_active === 1 || 
                              item.is_active === '1'
              
              return isActive
            })
            .sort((a, b) => {
              // Ordenar por order_index
              const orderA = parseInt(a.order_index) || 0
              const orderB = parseInt(b.order_index) || 0
              return orderA - orderB
            })
          
          // Mapear los items al formato esperado por el componente
          const mappedMenuItems = userDashboardItems.map(item => ({
            id: item.id,
            icon: getIconByMenu(item.title, item.menu_type),
            label: item.title,
            href: item.path || '#',
            description: item.description || ''
          }))
          
          setSubscriberMenuItems(mappedMenuItems)
        } else {
          console.error('❌ [UserLayout] Estructura de respuesta no esperada del API')
          setSubscriberMenuItems([])
        }
      } catch (error) {
        console.error('❌ [UserLayout] Error al cargar el menú del dashboard:', error)
        setSubscriberMenuItems([])
      } finally {
        setLoadingMenu(false)
      }
    }

    fetchUserMenu()
  }, [])


  // Funciones de manejo
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      onClose()
      await logout()
      console.log('✅ Sesión cerrada exitosamente')
    } catch (error) {
      console.error('❌ Error inesperado en el logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleHome = () => {
    navigate('/')
    onClose()
  }

  return (
    <>
      {/* Header Principal */}
      <Box
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={1000}
        shadow="sm"
      >
        <Container maxW="container.xl" px={isTablet ? 4 : 6}>
          <HStack justify="space-between" py={isTablet ? 3 : 4}>
            {/* Logo y Título */}
            <HStack spacing={isTablet ? 2.5 : 3}>
              <Box
                p={isTablet ? 1.5 : 2}
                borderRadius="lg"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
              >
                <Icon as={FiRadio} boxSize={isTablet ? 5 : 6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text
                  fontSize={isTablet ? "lg" : "xl"}
                  fontWeight="bold"
                  color={logoColor}
                  lineHeight="shorter"
                >
                  {title || 'Dashboard Suscriptor'}
                </Text>
                <Text 
                  fontSize="xs" 
                  color={textColor} 
                  fontWeight="medium"
                  display={isTablet ? "none" : "block"}
                >
                  {subtitle || 'Panel personal de Radio FM'}
                </Text>
              </VStack>
            </HStack>

            {/* Botones de Acción */}
            <HStack spacing={isTablet ? 1 : 2}>
              {/* Botón Home */}
              <IconButton
                aria-label="Ir al inicio"
                icon={<FiHome />}
                size={isTablet ? "xs" : "sm"}
                variant="ghost"
                onClick={handleHome}
                _hover={{
                  bg: 'gray.100',
                  color: 'blue.500'
                }}
              />

              {/* Botón de Menú Hamburguesa */}
              <IconButton
                aria-label="Abrir menú del dashboard"
                icon={<FiMenu />}
                variant="ghost"
                onClick={onOpen}
                size={isTablet ? "xs" : "sm"}
                _hover={{
                  bg: 'gray.100',
                  color: 'blue.500'
                }}
              />

              {/* Botón Logout */}
              <Button
                size={isTablet ? "xs" : "sm"}
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={FiLogOut} />}
                onClick={handleLogout}
                isLoading={isLoggingOut}
                loadingText={isTablet ? "Saliendo..." : "Cerrando..."}
                disabled={isLoggingOut}
                _hover={{
                  bg: 'red.500',
                  color: 'white',
                  borderColor: 'red.500'
                }}
                _active={{
                  bg: 'red.600',
                  transform: 'scale(0.98)'
                }}
                transition="all 0.2s"
              >
                {isTablet ? "Salir" : "Cerrar Sesión"}
              </Button>

              {/* Información del Usuario */}
              <HStack spacing={3}>
                <Avatar 
                  size="md" 
                  name={user?.name || 'Usuario'} 
                  bg="blue.500"
                  color="white"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" fontSize="sm">
                    {user?.name || 'Usuario Suscriptor'}
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    {user?.email || 'usuario@email.com'}
                  </Text>
                  <Badge colorScheme="blue" size="sm" variant="subtle">
                    SUSCRIPTOR
                  </Badge>
                </VStack>
              </HStack>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Contenido Principal */}
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>

      {/* Drawer Móvil */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack>
              <Icon as={FiRadio} color={logoColor} />
              <VStack align="start" spacing={0}>
                <Text color={logoColor} fontWeight="bold">
                  {title || 'Dashboard Suscriptor'}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Radio FM Management
                </Text>
              </VStack>
            </HStack>
          </DrawerHeader>
          
          <DrawerBody>
            <VStack align="stretch" spacing={2} pt={4}>
              {/* Botón de Escuchar - Siempre visible en el menú móvil */}
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={FiVolume2} />}
                onClick={onClose}
                _hover={{
                  bg: 'blue.500',
                  color: 'white',
                  borderColor: 'blue.500'
                }}
              >
                Escuchar Radio
              </Button>

              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />

              {/* Elementos del menú de navegación */}
              {loadingMenu ? (
                <Flex justify="center" align="center" py={8}>
                  <Spinner size="lg" color="blue.500" />
                  <Text ml={4} color={textColor}>
                    Cargando menú...
                  </Text>
                </Flex>
              ) : subscriberMenuItems.length > 0 ? (
                subscriberMenuItems.map((item, index) => (
                      <Button
                        key={`menu-item-${item.id || index}`}
                        as={RouterLink}
                        to={item.href}
                        justifyContent="start"
                        variant="ghost"
                        leftIcon={<Icon as={item.icon} />}
                        onClick={onClose}
                        h="50px"
                        w="100%"
                        _hover={{
                          bg: 'blue.50',
                          color: 'blue.600'
                        }}
                      >
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {item.label}
                          </Text>
                          {item.description && (
                            <Text fontSize="xs" color={textColor}>
                              {item.description}
                            </Text>
                          )}
                        </VStack>
                      </Button>
                ))
              ) : (
                <Text p={4} color={textColor} fontSize="sm" textAlign="center">
                  No hay elementos en el menú
                </Text>
              )}
              
              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />
              
              {/* Información del usuario */}
              <Box p={3} bg="gray.50" borderRadius="md">
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={user?.name || 'Usuario'} 
                    bg="blue.500"
                    color="white"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      {user?.name || 'Usuario Suscriptor'}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      {user?.email || 'usuario@email.com'}
                    </Text>
                    <Badge colorScheme="blue" size="sm" variant="subtle">
                      SUSCRIPTOR
                    </Badge>
                  </VStack>
                </HStack>
              </Box>

              {/* Botones de acción */}
              <HStack spacing={2} pt={2}>
                <Button
                  flex={1}
                  leftIcon={<Icon as={FiHome} />}
                  onClick={handleHome}
                  variant="outline"
                  colorScheme="blue"
                  _hover={{
                    bg: 'blue.50',
                    borderColor: 'blue.300'
                  }}
                  transition="all 0.2s"
                >
                  Inicio
                </Button>
                <Button
                  flex={1}
                  leftIcon={<Icon as={FiLogOut} />}
                  onClick={handleLogout}
                  colorScheme="red"
                  variant="outline"
                  isLoading={isLoggingOut}
                  loadingText="Saliendo..."
                  disabled={isLoggingOut}
                  _hover={{
                    bg: 'red.50',
                    borderColor: 'red.300',
                    color: 'red.600'
                  }}
                  _active={{
                    bg: 'red.100',
                    transform: 'scale(0.98)'
                  }}
                  transition="all 0.2s"
                >
                  Salir
                </Button>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default UserLayout

