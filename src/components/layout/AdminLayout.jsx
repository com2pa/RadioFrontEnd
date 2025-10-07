import React from 'react'
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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { FiMenu, FiHome, FiLogOut } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AdminLayout = ({ children, title, subtitle }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()

  // Menú específico para administradores
  const menuItems = [
    { label: 'Dashboard', href: '/dashboard/admin' },
    { label: 'Crear categoría Podcasts', href: '/dashboard/admin/podcast-category' },
    { label: 'Crear subcategoría de Podcasts', href: '/dashboard/admin/podcast-subcategory' },
    { label: 'Crear categoría de noticias', href: '/dashboard/admin/news-category' },
    { label: 'Crear subcategoría de noticias', href: '/dashboard/admin/news-subcategory' },
    { label: 'Crear Menú', href: '/dashboard/admin/menu-management' }
  ]

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.600">
                  {title || 'Panel de Administración'}
                </Heading>
                <Text color="gray.600">
                  {subtitle || 'Gestión completa del sistema Radio FM'}
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<FiMenu />} onClick={onOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<FiHome />} />
                <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
                <HStack spacing={4}>
                  <Avatar size="md" name="Admin" bg="red.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Administrador</Text>
                    <Text fontSize="sm" color="gray.600">admin@radiofm.com</Text>
                  </VStack>
                </HStack>
              </HStack>
            </HStack>
          </Box>

          {/* Barra lateral (Drawer) */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menú de Administración</DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={2}>
                  {menuItems.map((item, idx) => (
                    <Button
                      key={idx}
                      as={RouterLink}
                      to={item.href}
                      justifyContent="start"
                      variant="ghost"
                      onClick={onClose}
                    >
                      {item.label}
                    </Button>
                  ))}
                </VStack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cerrar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Contenido de la página */}
          {children}
        </VStack>
      </Container>
    </Box>
  )
}

export default AdminLayout
