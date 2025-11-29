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
  Spinner,
  Image
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
  FiHeadphones,
  FiSettings
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
  const { auth, logout } = useAuth()
  const user = auth // Extraer el usuario del objeto auth
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isSmallMobile = useBreakpointValue({ base: true, sm: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  
  // Debug: Log del estado de autenticación (remover en producción)
  // console.log('PublicMenu - Auth state:', auth)
  // console.log('PublicMenu - User state:', user)
  // console.log('PublicMenu - Is authenticated:', !!user)
  
  // Estado para los elementos del menú desde el API
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'      // Rojo Vibrante
  const brandDarkGray = '#333333' // Gris Oscuro
  const brandWhite = '#FFFFFF'    // Blanco Puro
  const brandLightGray = '#CCCCCC' // Gris Claro
  const brandOrange = '#FFA500'   // Naranja Vibrante

  const bgColor = useColorModeValue(brandWhite, brandDarkGray)
  const borderColor = useColorModeValue(brandLightGray, '#555555')
  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const logoColor = brandRed
  const hoverColor = brandRed

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

  const handleDashboard = () => {
    navigate('/dashboard')
    onClose()
  }

  // Función para obtener los elementos del menú desde el API
  const fetchMenuItems = React.useCallback(async () => {
    try {
      setLoading(true)
      
      // Obtener menú público desde el API
      const response = await axios.get('/api/menu/main')
      // console.log('Menu API response:', response.data)
      
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
        
        // console.log('Mapped menu items:', mappedItems)
        setMenuItems(mappedItems)
      } else {
        // Fallback a configuración local si el API falla
        // console.log('API failed, using local config')
        setMenuItems(getPublicMenuItems())
      }
    } catch (error) {
      // console.error('Error fetching menu items:', error)
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
        <Container maxW="container.xl" px={isTablet ? 4 : 6}>
          <HStack justify="space-between" py={isTablet ? 3 : 4}>
            {/* Logo */}
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none', opacity: 0.8 }} transition="opacity 0.2s">
              <HStack spacing={isSmallMobile ? 2 : isTablet ? 2.5 : 3}>
                <Image
                  src="/logo.png"
                  alt="OXÍGENO 88.1 FM TE MUEVE"
                  height={isSmallMobile ? "40px" : isTablet ? "45px" : "50px"}
                  objectFit="contain"
                  loading="eager"
                />
              </HStack>
            </ChakraLink>

            {/* Menú Desktop */}
            {!isMobile && (
              <HStack spacing={isTablet ? 4 : 8}>
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
                      fontSize={isTablet ? "sm" : "md"}
                      _hover={{ 
                        color: brandRed,
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
            <HStack spacing={isTablet ? 1 : 2}>
              {/* Botones que se ocultan en dispositivos muy pequeños */}
              {!isSmallMobile && (
                <>
                  {/* Botón de Escuchar */}
                  <Button
                    size={isTablet ? "xs" : "sm"}
                    variant="outline"
                    leftIcon={<Icon as={FiVolume2} />}
                    borderColor={brandRed}
                    color={brandRed}
                    _hover={{
                      bg: brandRed,
                      color: brandWhite,
                      borderColor: brandRed
                    }}
                  >
                    {isTablet ? "Escuchar" : "Escuchar"}
                  </Button>

                  {/* Menú de Usuario o Botones de Login/Register - Solo cuando NO está autenticado */}
                  {!user && (
                    <HStack spacing={isTablet ? 1 : 2}>
                      <Button
                        size={isTablet ? "xs" : "sm"}
                        variant="ghost"
                        leftIcon={<Icon as={FiLogIn} />}
                        onClick={handleLogin}
                        _hover={{
                          bg: brandRed + '10',
                          color: brandRed
                        }}
                        fontSize={isTablet ? "xs" : "sm"}
                      >
                        {isTablet ? "Entrar" : "Iniciar Sesión"}
                      </Button>
                      <Button
                        size={isTablet ? "xs" : "sm"}
                        bg={brandRed}
                        color={brandWhite}
                        leftIcon={<Icon as={FiUserPlus} />}
                        onClick={handleRegister}
                        fontSize={isTablet ? "xs" : "sm"}
                        _hover={{
                          bg: '#C00000',
                          transform: 'translateY(-1px)',
                          boxShadow: 'md'
                        }}
                      >
                        {isTablet ? "Registro" : "Registrarse"}
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
                        size={isTablet ? "xs" : "sm"}
                        _hover={{
                          bg: brandRed + '10',
                          color: brandRed
                        }}
                        fontSize={isTablet ? "xs" : "sm"}
                      >
                        {isTablet ? user.name?.split(' ')[0] : user.name}
                      </MenuButton>
                      <MenuList>
                        <MenuItem icon={<FiSettings />} onClick={handleDashboard}>
                          Dashboard
                        </MenuItem>
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
                </>
              )}

              {/* Botón de Menú Móvil - Siempre visible en móviles */}
              {isMobile && (
                <IconButton
                  aria-label="Abrir menú"
                  icon={<FiMenu />}
                  variant="ghost"
                  onClick={onOpen}
                  size="sm"
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
              <Image
                src="/logo.png"
                alt="OXÍGENO 88.1 FM TE MUEVE"
                height="40px"
                objectFit="contain"
              />
            </HStack>
          </DrawerHeader>
          
          <DrawerBody>
            <VStack align="stretch" spacing={2} pt={4}>
              {/* Botón de Escuchar - Siempre visible en el menú móvil */}
              <Button
                variant="outline"
                leftIcon={<Icon as={FiVolume2} />}
                onClick={onClose}
                borderColor={brandRed}
                color={brandRed}
                _hover={{
                  bg: brandRed,
                  color: brandWhite,
                  borderColor: brandRed
                }}
              >
                Escuchar Radio
              </Button>

              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />

              {/* Elementos del menú de navegación */}
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
              
              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />
              
              {/* Sección de usuario */}
                {user ? (
                  <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" color={textColor} px={3} fontWeight="medium">
                      Hola, {user.name}
                    </Text>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiSettings} />}
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Button>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiUser} />}
                    onClick={onClose}
                    >
                      Mi Perfil
                    </Button>
                    <Button
                      justifyContent="start"
                      variant="ghost"
                      leftIcon={<Icon as={FiLogIn} />}
                      onClick={handleLogout}
                    colorScheme="red"
                    >
                      Cerrar Sesión
                    </Button>
                  </VStack>
                ) : (
                  <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" color={textColor} px={3} fontWeight="medium">
                    Acceso
                  </Text>
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
                      bg={brandRed}
                      color={brandWhite}
                      leftIcon={<Icon as={FiUserPlus} />}
                      onClick={handleRegister}
                      _hover={{
                        bg: '#C00000'
                      }}
                    >
                      Registrarse
                    </Button>
                  </VStack>
                )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default PublicMenu
