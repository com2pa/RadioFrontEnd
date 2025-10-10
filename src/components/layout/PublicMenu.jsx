import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
  Icon,
  Link as ChakraLink,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useBreakpointValue,
  Spinner
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { 
  FiMenu, 
  FiRadio, 
  FiUser, 
  FiLogIn,
  FiUserPlus,
  FiVolume2,
  FiHome,
  FiInfo,
  FiBookOpen,
  FiMail,
  FiMusic,
  FiMic,
  FiCalendar,
  FiHeadphones
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { getPublicMenuItems } from '../../config/publicMenuConfig'
import axios from 'axios'

// Mapeo de iconos para los elementos del menú (fuera del componente para evitar dependencias)
const iconMap = {
  'home': FiHome,
  'about': FiInfo,
  'programs': FiRadio,
  'podcasts': FiHeadphones,
  'news': FiBookOpen,
  'events': FiCalendar,
  'contact': FiMail,
  'music': FiMusic,
  'mic': FiMic
}

const PublicMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  // Estado para los elementos del menú desde el API
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const logoColor = useColorModeValue('blue.600', 'blue.300')
  const hoverColor = useColorModeValue('blue.500', 'blue.300')

  const handleLogin = () => {
    navigate('/login')
    onClose()
  }

  const handleRegister = () => {
    navigate('/register')
    onClose()
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  // Función para obtener los elementos del menú desde el API
  const fetchMenuItems = React.useCallback(async () => {
    try {
      setLoading(true)
      
      // Obtener menú público desde el API
      const response = await axios.get('/api/menu/main')
      console.log('Menu API response:', response.data)
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Mapear los datos del API al formato esperado
        const mappedItems = response.data.data
          .filter(item => item.is_active) // Solo elementos activos
          .sort((a, b) => a.order_index - b.order_index) // Ordenar por índice
          .map(item => ({
            id: item.id || item.menu_id,
            label: item.title,
            href: item.path,
            icon: iconMap[item.menu_type] || FiHome, // Usar icono por tipo o FiHome por defecto
            description: item.description || ''
          }))
        
        console.log('Mapped menu items:', mappedItems)
        setMenuItems(mappedItems)
      } else {
        // Fallback a configuración local si el API falla
        console.log('API failed, using local config')
        setMenuItems(getPublicMenuItems())
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
      // Fallback a configuración local en caso de error
      setMenuItems(getPublicMenuItems())
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar elementos del menú al montar el componente
  useEffect(() => {
    fetchMenuItems()
  }, [fetchMenuItems])

  return (
    <>
      {/* Header Principal */}
      <Box
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={1000}
        shadow="sm"
      >
        <Container maxW="container.xl">
          <HStack justify="space-between" py={4}>
            {/* Logo */}
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  color="white"
                >
                  <Icon as={FiRadio} boxSize={6} />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={logoColor}
                    lineHeight="shorter"
                  >
                    OXÍ Radio
                  </Text>
                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                    88.1 FM Barquisimeto
                  </Text>
                </VStack>
              </HStack>
            </ChakraLink>

            {/* Menú Desktop */}
            {!isMobile && (
              <HStack spacing={8}>
                {loading ? (
                  <Spinner size="sm" color={hoverColor} />
                ) : (
                  menuItems.map((item) => (
                    <ChakraLink
                      key={item.id}
                      as={RouterLink}
                      to={item.href}
                      color={textColor}
                      fontWeight="medium"
                      _hover={{ 
                        color: hoverColor,
                        textDecoration: 'none'
                      }}
                      transition="color 0.2s"
                    >
                      {item.label}
                    </ChakraLink>
                  ))
                )}
              </HStack>
            )}

            {/* Botones de Acción */}
            <HStack spacing={4}>
              {/* Botón de Escuchar */}
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={FiVolume2} />}
                _hover={{
                  bg: 'blue.500',
                  color: 'white',
                  borderColor: 'blue.500'
                }}
              >
                Escuchar
              </Button>

              {/* Menú de Usuario o Botones de Login/Register - Solo cuando NO está autenticado */}
              {!user && (
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Icon as={FiLogIn} />}
                    onClick={handleLogin}
                    _hover={{
                      bg: 'white',
                      color: 'blue.500'
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiUserPlus} />}
                    onClick={handleRegister}
                  >
                    Registrarse
                  </Button>
                </HStack>
              )}

              {/* Menú de Usuario cuando SÍ está autenticado */}
              {user && (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    leftIcon={<Avatar size="xs" name={user.name} />}
                    size="sm"
                    _hover={{
                      bg: 'white',
                      color: 'blue.500'
                    }}
                  >
                    {user.name}
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiUser />}>
                      Mi Perfil
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FiLogIn />} onClick={handleLogout}>
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}

              {/* Botón de Menú Móvil */}
              {isMobile && (
                <IconButton
                  aria-label="Abrir menú"
                  icon={<FiMenu />}
                  variant="ghost"
                  onClick={onOpen}
                />
              )}
            </HStack>
          </HStack>
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
              <Text color={logoColor} fontWeight="bold">
                OXÍ Radio
              </Text>
            </HStack>
          </DrawerHeader>
          
          <DrawerBody>
            <VStack align="stretch" spacing={2} pt={4}>
              {loading ? (
                <Box textAlign="center" py={4}>
                  <Spinner size="md" color={hoverColor} />
                  <Text fontSize="sm" color={textColor} mt={2}>
                    Cargando menú...
                  </Text>
                </Box>
              ) : (
                menuItems.map((item) => (
                  <Button
                    key={item.id}
                    as={RouterLink}
                    to={item.href}
                    justifyContent="start"
                    variant="ghost"
                    leftIcon={<Icon as={item.icon} />}
                    onClick={onClose}
                  >
                    {item.label}
                  </Button>
                ))
              )}
              
              <Box pt={4} borderTop="1px" borderColor={borderColor}>
                {user ? (
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" color={textColor} px={3}>
                      Hola, {user.name}
                    </Text>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiUser} />}
                    >
                      Mi Perfil
                    </Button>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiLogIn} />}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </VStack>
                ) : (
                  <VStack align="stretch" spacing={2}>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiLogIn} />}
                      onClick={handleLogin}
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      justifyContent="start"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiUserPlus} />}
                      onClick={handleRegister}
                    >
                      Registrarse
                    </Button>
                  </VStack>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default PublicMenu
