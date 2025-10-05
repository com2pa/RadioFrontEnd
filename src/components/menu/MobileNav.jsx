import React from 'react'
import { Stack, useColorModeValue, Spinner, Text, Box, Button, HStack } from '@chakra-ui/react'
import MobileNavItem from './MobileNavItem'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardRoute } from '../../utils/roleUtils'
import { Link as RouterLink } from 'react-router-dom'

const MobileNav = ({ menuItems, loading, error }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const { auth } = useAuth()

  if (loading) {
    return (
      <Stack bg={bgColor} p={4} display={{ md: 'none' }} align="center">
        <Spinner size="sm" />
        <Text fontSize="sm" color="gray.500">
          Cargando menú...
        </Text>
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack bg={bgColor} p={4} display={{ md: 'none' }} align="center">
        <Text fontSize="sm" color="red.500">
          Error al cargar menú
        </Text>
      </Stack>
    )
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <Stack bg={bgColor} p={4} display={{ md: 'none' }} align="center">
        <Text fontSize="sm" color="gray.500">
          No hay elementos de menú disponibles
        </Text>
      </Stack>
    )
  }

  return (
    <Stack 
      bg={bgColor} 
      p={4} 
      display={{ md: 'none' }}
      spacing={2}
      maxH="70vh"
      overflowY="auto">
      {menuItems.map((navItem) => (
        <MobileNavItem key={navItem.id || navItem.label} {...navItem} />
      ))}
      {auth && (
        <HStack justify="space-between" pt={2}>
          <Text fontSize="sm">{auth.name || auth.email}</Text>
          <Button
            as={RouterLink}
            to={getDashboardRoute(auth)}
            size="sm"
            colorScheme="blue"
          >
            Ir al Dashboard
          </Button>
        </HStack>
      )}
    </Stack>
  )
}

export default MobileNav
