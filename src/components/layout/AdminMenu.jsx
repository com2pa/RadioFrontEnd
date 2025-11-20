import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
  Text,
  Divider,
  Box,
  Icon,
  HStack,
  Badge
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FiMenu, 
  FiRadio, 
  FiUsers, 
  FiShield,
  FiSettings,
  FiHome,
  FiLogOut,
  FiArrowLeft,
  FiMail,
  FiEdit3,
  FiList,
  FiFileText
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { adminMenuItems } from '../../config/adminMenuConfig'

/**
 * Componente reutilizable para el menú del dashboard administrativo
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del drawer
 * @param {function} props.onClose - Función para cerrar el drawer
 * @param {string} props.currentPage - Página actual para resaltar el elemento activo
 * @param {boolean} props.showHeader - Mostrar header con información del admin
 * @param {boolean} props.showFooter - Mostrar footer con botones adicionales
 * @param {Array} props.customItems - Elementos adicionales del menú
 * @param {function} props.onLogout - Función personalizada para logout
 */
const AdminMenu = ({
  isOpen,
  onClose,
  currentPage = '',
  showHeader = true,
  showFooter = true,
  customItems = [],
  onLogout,
  ...props
}) => {
  const { logout } = useAuth()
  
  // Combinar elementos del menú con elementos personalizados
  const allMenuItems = [...adminMenuItems, ...customItems]
  
  // Función para obtener el icono
  const getIcon = (iconName) => {
    const iconMap = {
      FiMenu,
      FiRadio,
      FiUsers,
      FiShield,
      FiSettings,
      FiHome,
      FiLogOut,
      FiArrowLeft,
      FiMail,
      FiEdit3,
      FiList
    }
    return iconMap[iconName] || FiSettings
  }
  
  // Función para determinar si un elemento está activo
  const isActiveItem = (href) => {
    return currentPage === href || window.location.pathname === href
  }
  
  // Función para manejar el logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
    }
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs" {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        
        {showHeader && (
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200">
            <VStack align="start" spacing={2}>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                Panel Administrativo
              </Text>
              <Text fontSize="sm" color="gray.500">
                Radio FM Management
              </Text>
            </VStack>
          </DrawerHeader>
        )}
        
        <DrawerBody pt={4}>
          <VStack align="stretch" spacing={1}>
            {allMenuItems.map((item) => {
              const IconComponent = getIcon(item.icon)
              const isActive = isActiveItem(item.href)
              
              return (
                <Button
                  key={item.id}
                  as={RouterLink}
                  to={item.href || '#'}
                  justifyContent="start"
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={isActive ? "blue" : "gray"}
                  size="md"
                  leftIcon={<Icon as={IconComponent} />}
                  onClick={onClose}
                  _hover={{
                    bg: isActive ? "blue.600" : "gray.100"
                  }}
                  position="relative"
                  h="auto"
                  py={3}
                  px={4}
                >
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text fontSize="xs" color={isActive ? "whiteAlpha.800" : "gray.500"} noOfLines={1}>
                        {item.description}
                      </Text>
                    )}
                  </VStack>
                  {isActive && (
                    <Badge 
                      colorScheme="blue" 
                      variant="solid" 
                      size="sm"
                      position="absolute"
                      right={2}
                      top={2}
                      fontSize="xs"
                    >
                      ACTIVO
                    </Badge>
                  )}
                </Button>
              )
            })}
          </VStack>
        </DrawerBody>
        
        {showFooter && (
          <DrawerFooter borderTopWidth="1px" borderColor="gray.200">
            <VStack align="stretch" spacing={2} w="full">
              <HStack spacing={2}>
                <Button
                  as={RouterLink}
                  to="/dashboard/admin"
                  leftIcon={<FiHome />}
                  variant="outline"
                  size="sm"
                  flex={1}
                  onClick={onClose}
                >
                  Dashboard
                </Button>
                <Button
                  leftIcon={<FiLogOut />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  flex={1}
                  onClick={handleLogout}
                >
                  Salir
                </Button>
              </HStack>
            </VStack>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default AdminMenu