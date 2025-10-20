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
  Progress
} from '@chakra-ui/react'
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiHeart, 
  FiShare2, 
  FiUsers,
  FiRadio,
  FiDownload
} from 'react-icons/fi'

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong] = useState({
    title: "Música en Vivo",
    artist: "OXÍ Radio 88.1 FM",
    duration: "00:00"
  })
  const [listeners] = useState(1247)
  
  const toast = useToast()

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
      bgGradient="linear(to-r, blue.600, purple.600)"
      color="white"
      py={20}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.2}
        zIndex={0}
      />
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          <VStack spacing={4}>
            <Badge colorScheme="yellow" fontSize="sm" px={3} py={1} borderRadius="full">
              🔴 EN VIVO
            </Badge>
            <Heading size="2xl" fontWeight="bold">
              OXÍ Radio 88.1 FM
            </Heading>
            <Text fontSize="xl" opacity={0.9}>
              La mejor música y noticias de Barquisimeto
            </Text>
          </VStack>

          {/* Player Principal */}
          <Card bg="white" color="gray.800" maxW="500px" w="full" boxShadow="2xl">
            <CardBody p={6}>
              <VStack spacing={4}>
                <HStack spacing={4} w="full">
                  <Avatar
                    size="lg"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    icon={<Icon as={FiRadio} boxSize={8} />}
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="bold" fontSize="lg">
                      {currentSong.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {currentSong.artist}
                    </Text>
                    <HStack spacing={2}>
                      <Icon as={FiUsers} boxSize={4} color="blue.500" />
                      <Text fontSize="sm" color="gray.600">
                        {listeners.toLocaleString()} oyentes
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                <HStack spacing={4} w="full">
                  <IconButton
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                    size="lg"
                    colorScheme="blue"
                    onClick={handlePlayPause}
                    borderRadius="full"
                  />
                  <VStack spacing={1} flex={1}>
                    <Progress value={65} colorScheme="blue" size="sm" borderRadius="full" />
                    <HStack justify="space-between" w="full" fontSize="xs" color="gray.600">
                      <Text>2:34</Text>
                      <Text>4:12</Text>
                    </HStack>
                  </VStack>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Me gusta"
                      icon={<Icon as={FiHeart} />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Compartir"
                      icon={<Icon as={FiShare2} />}
                      size="sm"
                      variant="ghost"
                    />
                  </HStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <HStack spacing={4}>
            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              colorScheme="white"
              size="lg"
            >
              Descargar App
            </Button>
            <Button
              leftIcon={<Icon as={FiUsers} />}
              variant="solid"
              colorScheme="white"
              color="blue.600"
              size="lg"
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
