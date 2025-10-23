import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  Avatar,
  IconButton,
  useToast,
  Progress,
  Image,
  Flex,
  useBreakpointValue
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiHeart, 
  FiShare2, 
  FiUsers,
  FiRadio,
  FiDownload,
  FiStar,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'

// Animaciones personalizadas
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
`

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong] = useState({
    title: "Música en Vivo",
    artist: "OXÍ Radio 88.1 FM",
    duration: "00:00"
  })
  const [listeners] = useState(1247)
  
  const toast = useToast()
  
  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  const isDesktop = useBreakpointValue({ base: false, lg: true })

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    toast({
      title: isPlaying ? 'Pausando transmisión' : 'Iniciando transmisión',
      description: isPlaying ? 'La radio se ha pausado' : '¡Disfruta de OXÍ Radio!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box
      bgGradient="linear(135deg, blue.600, purple.600, pink.500)"
      color="white"
      py={{ base: 12, md: 16, lg: 24 }}
      position="relative"
      overflow="hidden"
      minH={{ base: "80vh", md: "90vh", lg: "100vh" }}
      display="flex"
      alignItems="center"
    >
      {/* Efectos de fondo animados */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.15}
        zIndex={0}
      />
      
      {/* Partículas flotantes */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="20px"
        h="20px"
        bg="white"
        borderRadius="full"
        opacity={0.6}
        animation={`${float} 3s ease-in-out infinite`}
        zIndex={1}
      />
      <Box
        position="absolute"
        top="60%"
        right="15%"
        w="15px"
        h="15px"
        bg="yellow.300"
        borderRadius="full"
        opacity={0.7}
        animation={`${float} 4s ease-in-out infinite reverse`}
        zIndex={1}
      />
      <Box
        position="absolute"
        top="40%"
        right="25%"
        w="25px"
        h="25px"
        bg="pink.300"
        borderRadius="full"
        opacity={0.5}
        animation={`${float} 5s ease-in-out infinite`}
        zIndex={1}
      />

      <Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }} textAlign="center">
          {/* Header con animación */}
          <VStack spacing={{ base: 4, md: 6 }} animation={`${pulse} 2s ease-in-out infinite`}>
            <Badge 
              colorScheme="yellow" 
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              bg="yellow.400"
              color="black"
              fontWeight="bold"
              animation={`${glow} 2s ease-in-out infinite`}
            >
              🔴 EN VIVO AHORA
            </Badge>
            <Heading 
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="black"
              bgGradient="linear(to-r, white, yellow.200, white)"
              bgClip="text"
              textShadow="0 0 30px rgba(255,255,255,0.5)"
              lineHeight="shorter"
            >
              OXÍ Radio 88.1 FM
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }} 
              opacity={0.95} 
              fontWeight="medium"
              maxW={{ base: "90%", md: "80%", lg: "70%" }}
              lineHeight="tall"
            >
              La mejor música y noticias de Barquisimeto
            </Text>
            
            {/* Estadísticas destacadas */}
            <HStack 
              spacing={{ base: 4, md: 6, lg: 8 }} 
              mt={4}
              flexWrap="wrap"
              justify="center"
            >
              <VStack spacing={1}>
                <Icon as={FiUsers} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{listeners.toLocaleString()}</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Oyentes</Text>
              </VStack>
              <VStack spacing={1}>
                <Icon as={FiStar} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">4.9</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Rating</Text>
              </VStack>
              <VStack spacing={1}>
                <Icon as={FiTrendingUp} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">#1</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>En la ciudad</Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Player Principal Mejorado */}
          <Card 
            bg="rgba(255,255,255,0.95)" 
            color="gray.800" 
            maxW={{ base: "100%", md: "600px" }}
            w="full" 
            boxShadow="0 25px 50px rgba(0,0,0,0.3)"
            borderRadius={{ base: "xl", md: "2xl" }}
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.2)"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: '0 35px 70px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <CardBody p={{ base: 4, md: 6, lg: 8 }}>
              <VStack spacing={{ base: 4, md: 6 }}>
                <HStack spacing={{ base: 4, md: 6 }} w="full" flexDir={{ base: "column", sm: "row" }}>
                  <Avatar
                    size={{ base: "lg", md: "xl" }}
                    bgGradient="linear(135deg, blue.500, purple.500, pink.500)"
                    icon={<Icon as={FiRadio} boxSize={{ base: 6, md: 8, lg: 10 }} />}
                    animation={isPlaying ? `${pulse} 1s ease-in-out infinite` : 'none'}
                    boxShadow="0 10px 30px rgba(59, 130, 246, 0.4)"
                  />
                  <VStack align={{ base: "center", sm: "start" }} spacing={2} flex={1} textAlign={{ base: "center", sm: "left" }}>
                    <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color="gray.800">
                      {currentSong.title}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" fontWeight="medium">
                      {currentSong.artist}
                    </Text>
                    <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} boxSize={{ base: 4, md: 5 }} color="green.500" />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                          {listeners.toLocaleString()} oyentes
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiZap} boxSize={{ base: 4, md: 5 }} color="orange.500" />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                          En vivo
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </HStack>

                <HStack spacing={{ base: 4, md: 6 }} w="full" flexDir={{ base: "column", sm: "row" }}>
                  <IconButton
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                    size={{ base: "lg", md: "xl" }}
                    colorScheme="blue"
                    onClick={handlePlayPause}
                    borderRadius="full"
                    bgGradient="linear(135deg, blue.500, purple.500)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(135deg, blue.600, purple.600)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.6)'
                    }}
                    animation={isPlaying ? `${pulse} 1.5s ease-in-out infinite` : 'none'}
                  />
                  <VStack spacing={2} flex={1} w="full">
                    <Progress 
                      value={65} 
                      colorScheme="blue" 
                      size={{ base: "md", md: "lg" }}
                      borderRadius="full"
                      bg="gray.200"
                      _filledTrack={{
                        bgGradient: 'linear(to-r, blue.400, purple.400)'
                      }}
                    />
                    <HStack justify="space-between" w="full" fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                      <Text>2:34</Text>
                      <Text>4:12</Text>
                    </HStack>
                  </VStack>
                  <HStack spacing={{ base: 2, md: 3 }} justify="center">
                    <IconButton
                      aria-label="Me gusta"
                      icon={<Icon as={FiHeart} />}
                      size={{ base: "md", md: "lg" }}
                      variant="ghost"
                      colorScheme="red"
                      _hover={{ bg: 'red.50', color: 'red.500' }}
                    />
                    <IconButton
                      aria-label="Compartir"
                      icon={<Icon as={FiShare2} />}
                      size={{ base: "md", md: "lg" }}
                      variant="ghost"
                      colorScheme="blue"
                      _hover={{ bg: 'blue.50', color: 'blue.500' }}
                    />
                  </HStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Botones de acción mejorados */}
          <HStack 
            spacing={{ base: 4, md: 6 }} 
            flexWrap="wrap" 
            justify="center"
            flexDir={{ base: "column", sm: "row" }}
            w="full"
            maxW={{ base: "100%", md: "600px" }}
          >
            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              colorScheme="white"
              size={{ base: "md", md: "lg", lg: "xl" }}
              bg="rgba(255,255,255,0.1)"
              border="2px solid white"
              color="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight="bold"
              w={{ base: "full", sm: "auto" }}
            >
              Descargar App
            </Button>
            <Button
              leftIcon={<Icon as={FiUsers} />}
              variant="solid"
              colorScheme="yellow"
              size={{ base: "md", md: "lg", lg: "xl" }}
              bgGradient="linear(135deg, yellow.400, orange.400)"
              color="black"
              _hover={{
                bgGradient: 'linear(135deg, yellow.500, orange.500)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4)'
              }}
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight="bold"
              w={{ base: "full", sm: "auto" }}
            >
              Unirse al Chat
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default HeroSection
