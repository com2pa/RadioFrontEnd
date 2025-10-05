import React from 'react'
import {
  Box,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Spinner,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react'
import DesktopSubNav from './DesktopSubNav'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardRoute } from '../../utils/roleUtils'
import { Link as RouterLink } from 'react-router-dom'

const DesktopNav = ({ menuItems, loading, error }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')
  const { auth } = useAuth()

  if (loading) {
    return (
      <Stack direction={'row'} spacing={4} align="center">
        <Spinner size="sm" />
        <Text fontSize="sm" color={linkColor}>
          Cargando menú...
        </Text>
      </Stack>
    )
  }

  if (error) {
    return (
      <Stack direction="column" spacing={2}>
        <Text fontSize="sm" color="red.500">
          Error al cargar menú
        </Text>
        <Text fontSize="xs" color="gray.500">
          {error}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Verifica que el backend esté funcionando en puerto 3000
        </Text>
      </Stack>
    )
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <Text fontSize="sm" color="gray.500">
        No hay elementos de menú disponibles
      </Text>
    )
  }

  return (
    <Stack 
      direction={'row'} 
      spacing={{ base: 2, md: 4 }}
      wrap="wrap"
      align="center"
      justify="center">
      {menuItems.map((navItem) => (
        <Box key={navItem.id || navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as="a"
                p={{ base: 1, md: 2 }}
                href={navItem.href ?? '#'}
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight={500}
                color={linkColor}
                whiteSpace="nowrap"
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && navItem.children.length > 0 && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={{ base: '200px', md: 'sm' }}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.id || child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
      {auth && (
        <HStack pl={2} spacing={2}>
          <Text fontSize={{ base: 'xs', md: 'sm' }} color={linkColor}>
            {auth.name || auth.email}
          </Text>
          <Button
            as={RouterLink}
            to={getDashboardRoute(auth)}
            size="sm"
            colorScheme="blue"
            variant="solid"
          >
            Ir al Dashboard
          </Button>
        </HStack>
      )}
    </Stack>
  )
}

export default DesktopNav
