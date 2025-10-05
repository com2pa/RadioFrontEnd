import React from 'react'
import {
  Box,
  Stack,
  Text,
  Icon,
  useDisclosure,
  useColorModeValue,
  Collapse,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        borderRadius="md"
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.100', 'gray.700'),
        }}>
        <Text 
          fontWeight={600} 
          color={useColorModeValue('gray.600', 'gray.200')}
          fontSize={{ base: 'sm', md: 'md' }}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={5}
            h={5}
            color={useColorModeValue('gray.500', 'gray.400')}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={2}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
          spacing={1}>
          {children &&
            children.map((child) => (
              <Box 
                as="a" 
                key={child.label} 
                py={2} 
                px={2}
                href={child.href}
                borderRadius="md"
                fontSize="sm"
                color={useColorModeValue('gray.500', 'gray.300')}
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.600'),
                  color: useColorModeValue('gray.700', 'gray.100'),
                }}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default MobileNavItem
