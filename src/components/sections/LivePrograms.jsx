import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  AspectRatio,
  useToast
} from '@chakra-ui/react'
import { 
  FiClock,
  FiUsers,
  FiVolume2,
  FiVideo
} from 'react-icons/fi'

const LivePrograms = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const toast = useToast()

  // Simular datos de la radio
  const featuredShows = [
    {
      id: 1,
      title: "Música del Momento",
      host: "DJ Carlos",
      time: "08:00 - 12:00",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      listeners: 856
    },
    {
      id: 2,
      title: "Noticias del Día",
      host: "María González",
      time: "12:00 - 14:00",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      listeners: 423
    },
    {
      id: 3,
      title: "Deportes en Vivo",
      host: "Roberto Silva",
      time: "14:00 - 18:00",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      listeners: 634
    }
  ]

  const handleListen = (showTitle) => {
    toast({
      title: 'Iniciando transmisión de audio',
      description: `Sintonizando ${showTitle} en audio`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleWatch = (showTitle) => {
    toast({
      title: 'Iniciando transmisión de video',
      description: `Abriendo video en vivo de ${showTitle}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={accentColor}>
              Programas en Vivo
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="600px">
              Disfruta de nuestros programas más populares con los mejores conductores de Barquisimeto
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {featuredShows.map((show) => (
              <Card key={show.id} bg={cardBg} boxShadow="lg" _hover={{ transform: 'translateY(-4px)', transition: 'all 0.3s' }}>
                <AspectRatio ratio={16/9}>
                  <Image
                    src={show.image}
                    alt={show.title}
                    objectFit="cover"
                    borderRadius="md"
                  />
                </AspectRatio>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {show.title}
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        Con {show.host}
                      </Text>
                      <HStack spacing={2}>
                        <Icon as={FiClock} boxSize={4} color="blue.500" />
                        <Text fontSize="sm" color="gray.600">
                          {show.time}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack justify="space-between" w="full">
                      <HStack spacing={1}>
                        <Icon as={FiUsers} boxSize={4} color="green.500" />
                        <Text fontSize="sm" color="gray.600">
                          {show.listeners} oyentes
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          colorScheme="blue" 
                          variant="outline"
                          leftIcon={<Icon as={FiVolume2} />}
                          onClick={() => handleListen(show.title)}
                        >
                          Escuchar
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="purple" 
                          variant="outline"
                          leftIcon={<Icon as={FiVideo} />}
                          onClick={() => handleWatch(show.title)}
                        >
                          Ver
                        </Button>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default LivePrograms
