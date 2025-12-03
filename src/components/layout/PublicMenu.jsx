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
        <Container maxW="container.xl" px={{ base: 3, sm: 4, md: 5, lg: 6 }}>
          <HStack 
            justify="space-between" 
            align="center"
            py={{ base: 2, sm: 3, md: 4 }}
            spacing={{ base: 2, sm: 3, md: 4 }}
            flexWrap={{ base: "nowrap", lg: "nowrap" }}
          >
            {/* Logo */}
            <ChakraLink 
              as={RouterLink} 
              to="/" 
              _hover={{ textDecoration: 'none', opacity: 0.8 }} 
              transition="opacity 0.2s"
              flexShrink={0}
            >
              <HStack spacing={{ base: 1.5, sm: 2, md: 2.5, lg: 3 }}>
                <Image
                  src="/logo.png"
                  alt="OXÍGENO 88.1 FM TE MUEVE"
                  height={{ base: "35px", sm: "40px", md: "45px", lg: "50px" }}
                  objectFit="contain"
                  loading="eager"
                />
              </HStack>
            </ChakraLink>

            {/* Menú Desktop */}
            {!isMobile && (
              <HStack 
                spacing={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
                flex={1}
                justify="center"
                display={{ base: "none", md: "flex" }}
                flexWrap="wrap"
              >
                {loading ? (
                  <Spinner size={{ base: "xs", md: "sm" }} color={hoverColor} />
                ) : (
                  menuItems.map((item) => (
                    <ChakraLink
                      key={item.id}
                      as={RouterLink}
                      to={item.href}
                      color={textColor}
                      fontWeight="medium"
                      fontSize={{ base: "xs", md: "sm", lg: "md" }}
                      whiteSpace="nowrap"
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
            <HStack 
              spacing={{ base: 1, sm: 1.5, md: 2 }}
              flexShrink={0}
              align="center"
            >
              {/* Botones que se ocultan en dispositivos muy pequeños */}
              {!isSmallMobile && (
                <>
                  {/* Menú de Usuario o Botones de Login/Register - Solo cuando NO está autenticado */}
                  {!user && (
                    <HStack spacing={{ base: 1, sm: 1.5, md: 2 }} flexWrap="nowrap">
                      <Button
                        size={{ base: "xs", sm: "sm", md: "sm" }}
                        variant="ghost"
                        leftIcon={<Icon as={FiLogIn} boxSize={{ base: 3, md: 4 }} />}
                        onClick={handleLogin}
                        _hover={{
                          bg: brandRed + '10',
                          color: brandRed
                        }}
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        px={{ base: 2, sm: 3, md: 4 }}
                      >
                        <Text display={{ base: "none", sm: "block" }}>
                          {isTablet ? "Entrar" : "Iniciar Sesión"}
                        </Text>
                        <Text display={{ base: "block", sm: "none" }}>
                          Entrar
                        </Text>
                      </Button>
                      <Button
                        size={{ base: "xs", sm: "sm", md: "sm" }}
                        bg={brandRed}
                        color={brandWhite}
                        leftIcon={<Icon as={FiUserPlus} boxSize={{ base: 3, md: 4 }} />}
                        onClick={handleRegister}
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        px={{ base: 2, sm: 3, md: 4 }}
                        _hover={{
                          bg: '#C00000',
                          transform: 'translateY(-1px)',
                          boxShadow: 'md'
                        }}
                      >
                        <Text display={{ base: "none", sm: "block" }}>
                          {isTablet ? "Registro" : "Registrarse"}
                        </Text>
                        <Text display={{ base: "block", sm: "none" }}>
                          Reg
                        </Text>
                      </Button>
                    </HStack>
                  )}

                  {/* Menú de Usuario cuando SÍ está autenticado */}
                  {user && (
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="ghost"
                        leftIcon={<Avatar size={{ base: "2xs", sm: "xs" }} name={user.name || user.user_name} />}
                        size={{ base: "xs", sm: "sm", md: "sm" }}
                        _hover={{
                          bg: brandRed + '10',
                          color: brandRed
                        }}
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        px={{ base: 2, sm: 3, md: 4 }}
                        maxW={{ base: "120px", sm: "150px", md: "200px" }}
                      >
                        <Text 
                          noOfLines={1}
                          display={{ base: "none", sm: "block" }}
                        >
                          {isTablet ? (user.name || user.user_name)?.split(' ')[0] : (user.name || user.user_name)}
                        </Text>
                        <Text display={{ base: "block", sm: "none" }}>
                          {(user.name || user.user_name)?.split(' ')[0]?.substring(0, 8)}
                        </Text>
                      </MenuButton>
                      <MenuList>
                        <MenuItem 
                          icon={<FiSettings />} 
                          onClick={handleDashboard}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Dashboard
                        </MenuItem>
                        {/* <MenuItem 
                          icon={<FiUser />}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Mi Perfil
                        </MenuItem> */}
                        {/* <MenuDivider /> */}
                        <MenuItem 
                          icon={<FiLogIn />} 
                          onClick={handleLogout}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
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
                  size={{ base: "sm", sm: "md" }}
                />
              )}
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Drawer Móvil */}
      <Drawer 
        isOpen={isOpen} 
        placement="left" 
        onClose={onClose} 
        size={{ base: "xs", sm: "sm" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size={{ base: "sm", md: "md" }} />
          <DrawerHeader 
            borderBottomWidth="1px"
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
          >
            <HStack>
              <Image
                src="/logo.png"
                alt="OXÍGENO 88.1 FM TE MUEVE"
                height={{ base: "35px", sm: "40px" }}
                objectFit="contain"
              />
            </HStack>
          </DrawerHeader>
          
          <DrawerBody px={{ base: 3, md: 4 }} py={{ base: 4, md: 6 }}>
            <VStack align="stretch" spacing={{ base: 2, md: 3 }} pt={2}>
              {/* Elementos del menú de navegación */}
              {loading ? (
                <Box textAlign="center" py={4}>
                  <Spinner size={{ base: "sm", md: "md" }} color={hoverColor} />
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color={textColor} 
                    mt={2}
                  >
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
                    leftIcon={<Icon as={item.icon} boxSize={{ base: 4, md: 5 }} />}
                    onClick={onClose}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
                  >
                    {item.label}
                  </Button>
                ))
              )}
              
              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={{ base: 2, md: 3 }} />
              
              {/* Sección de usuario */}
              {user ? (
                <VStack align="stretch" spacing={2}>
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color={textColor} 
                    px={3} 
                    fontWeight="medium"
                  >
                    Hola, {user.name || user.user_name}
                  </Text>
                  <Button
                    justifyContent="start"
                    variant="ghost"
                    leftIcon={<Icon as={FiSettings} boxSize={{ base: 4, md: 5 }} />}
                    onClick={handleDashboard}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    justifyContent="start"
                    variant="ghost"
                    leftIcon={<Icon as={FiUser} boxSize={{ base: 4, md: 5 }} />}
                    onClick={onClose}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
                  >
                    Mi Perfil
                  </Button>
                  <Button
                    justifyContent="start"
                    variant="ghost"
                    leftIcon={<Icon as={FiLogIn} boxSize={{ base: 4, md: 5 }} />}
                    onClick={handleLogout}
                    colorScheme="red"
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
                  >
                    Cerrar Sesión
                  </Button>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={2}>
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color={textColor} 
                    px={3} 
                    fontWeight="medium"
                  >
                    Acceso
                  </Text>
                  <Button
                    justifyContent="start"
                    variant="ghost"
                    leftIcon={<Icon as={FiLogIn} boxSize={{ base: 4, md: 5 }} />}
                    onClick={handleLogin}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    justifyContent="start"
                    bg={brandRed}
                    color={brandWhite}
                    leftIcon={<Icon as={FiUserPlus} boxSize={{ base: 4, md: 5 }} />}
                    onClick={handleRegister}
                    _hover={{
                      bg: '#C00000'
                    }}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    py={{ base: 5, md: 6 }}
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
