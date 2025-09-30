import React from 'react'
import { Stack, useColorModeValue, Spinner, Text, Box } from '@chakra-ui/react'
import MobileNavItem from './MobileNavItem'

const MobileNav = ({ menuItems, loading, error }) => {
  const bgColor = useColorModeValue('white', 'gray.800')

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
    <Stack bg={bgColor} p={4} display={{ md: 'none' }}>
      {menuItems.map((navItem) => (
        <MobileNavItem key={navItem.id || navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

export default MobileNav
