import React from 'react'
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import DesktopNav from '../components/menu/DesktopNav'
import MobileNav from '../components/menu/MobileNav'
import { useMenu } from '../hooks/useMenu'

const Menu = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { menuItems, loading, error } = useMenu()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold">
            Logo
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav 
              menuItems={menuItems} 
              loading={loading} 
              error={error} 
            />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={{ base: 2, md: 6 }}>
          <Button 
            as={'a'} 
            fontSize={{ base: 'xs', md: 'sm' }} 
            fontWeight={400} 
            variant={'link'} 
            href={'#'}
            display={{ base: 'none', sm: 'inline-flex' }}>
            Sign In
          </Button>
          <Button
            as={'a'}
            display={{ base: 'none', sm: 'inline-flex' }}
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'#'}
            size={{ base: 'sm', md: 'md' }}
            _hover={{
              bg: 'pink.300',
            }}>
            Sign Up
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav 
          menuItems={menuItems} 
          loading={loading} 
          error={error} 
        />
      </Collapse>
    </Box>
  )
}

export default Menu