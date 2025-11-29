import React, { useState, useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'
import { useParams, useNavigate } from 'react-router-dom'
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
  Avatar,
  Image,
  Flex,
  Divider,
  Textarea,
  useToast,
  Spinner,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import axios from 'axios'
import PublicLayout from '../../components/layout/PublicLayout'
import PublicFooter from '../../components/layout/PublicFooter'
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiHeart,
  FiShare2,
  FiSend,
  FiRadio,
  FiUsers,
  FiMessageCircle,
  FiVideo,
  FiMaximize2,
  FiSettings,
} from 'react-icons/fi'

// Animaciones
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const ProgramView = () => {
  const { id } = useParams() // ID del programa desde la URL
  const navigate = useNavigate()
  const toast = useToast()
  
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandOrange = '#FFA500'
  
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  // Estados para la transmisión en vivo
  const [streamUrl, setStreamUrl] = useState('')
  const [streamType] = useState('hls') // 'hls', 'rtmp', 'youtube', 'twitch'
  const videoRef = useRef(null)
  
  // Cargar información del programa
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true)
        // Si hay un ID, buscar el programa específico
        if (id) {
          const response = await axios.get(`/api/programs/${id}`)
          if (response.data.success) {
            setProgram(response.data.data)
          }
        } else {
          // Si no hay ID, obtener el programa actual o el primero disponible
          const response = await axios.get('/api/programs/all')
          if (response.data.success && response.data.data && response.data.data.length > 0) {
            // Obtener el programa más reciente o el primero
            const programs = response.data.data
              .filter(p => p.program_image)
              .sort((a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date))
            setProgram(programs[0] || response.data.data[0])
          }
        }
      } catch (error) {
        // console.error('Error fetching program:', error)
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del programa',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProgram()
  }, [id, toast])
  
  // Cargar URL de transmisión en vivo (solo una vez)
  useEffect(() => {
    const defaultStreamUrl = import.meta.env?.VITE_STREAM_URL || 
      'http://localhost:8000/live/stream.m3u8'
    setStreamUrl(defaultStreamUrl)
  }, [])
  
  // Inicializar HLS cuando streamUrl esté disponible
  useEffect(() => {
    if (!streamUrl || streamType !== 'hls') {
      // console.log('⏸️ HLS no inicializado - streamUrl:', streamUrl, 'streamType:', streamType)
      return
    }
    
    // Capturar referencia del video al inicio para evitar problemas en cleanup
    const videoElement = videoRef.current
    let hlsInstance = null
    let timer = null
    
    // Esperar a que el video element esté disponible
    const initHLS = () => {
      const video = videoRef.current || videoElement
      if (!video) {
        // console.log('⏳ Esperando video element...')
        timer = setTimeout(initHLS, 100)
        return
      }
      
      // console.log('🔄 Inicializando HLS con URL:', streamUrl)
      
      // Usar HLS.js para mejor compatibilidad
      if (Hls.isSupported()) {
        // console.log('✅ HLS.js soportado, inicializando...')
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: false, // Desactivar para evitar congelamientos
          backBufferLength: 60, // Buffer más grande para estabilidad
          maxBufferLength: 60, // 60 segundos de buffer
          maxMaxBufferLength: 120, // Máximo 120 segundos
          maxBufferSize: 100 * 1000 * 1000, // 100MB de buffer
          maxBufferHole: 0.5, // Tolerancia para gaps en el buffer
          highBufferWatchdogPeriod: 3, // Verificar buffer cada 3 segundos
          nudgeOffset: 0.1,
          nudgeMaxRetry: 5, // Más reintentos para recuperación
          maxFragLoadingTimeOut: 30000, // 30 segundos para cargar fragmentos
          fragLoadingTimeOut: 30000,
          manifestLoadingTimeOut: 15000, // 15 segundos para el manifest
          levelLoadingTimeOut: 15000,
          startLevel: -1, // Auto-detect nivel inicial
          capLevelToPlayerSize: false, // No limitar calidad por tamaño del player
          debug: false,
          xhrSetup: (xhr) => {
            // Permitir CORS
            xhr.withCredentials = false
            // Timeout más largo para requests
            xhr.timeout = 30000
          }
        })
        
        hlsInstance.loadSource(streamUrl)
        hlsInstance.attachMedia(video)
        
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (import.meta.env.DEV) {
            // console.log('✅ Manifest HLS parseado correctamente')
          }
          const currentVideo = videoRef.current
          if (currentVideo && currentVideo.paused) {
            currentVideo.play().catch(() => {
              // Silencioso - solo log en desarrollo
            })
          }
        })
        
        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          // Manejar errores no fatales (como bufferStalledError)
          if (!data.fatal) {
            if (data.type === Hls.ErrorTypes.MEDIA_ERROR && data.details === 'bufferStalledError') {
              if (import.meta.env.DEV) {
                // console.warn('⚠️ Buffer stalling detectado, intentando recuperar...')
              }
              // Intentar recuperar automáticamente
              const currentVideo = videoRef.current
              if (currentVideo && currentVideo.readyState >= 2) {
                // Si el video tiene datos suficientes, intentar continuar
                try {
                  currentVideo.play().catch(() => {
                    // Si falla, recargar el stream desde el último punto
                    hlsInstance.startLoad()
                  })
                } catch {
                  hlsInstance.startLoad()
                }
              } else {
                // Si no hay datos suficientes, recargar
                hlsInstance.startLoad()
              }
            }
            return
          }
          
          // Manejar errores fatales
          if (import.meta.env.DEV) {
            // console.error('❌ Error HLS fatal:', data)
          }
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (import.meta.env.DEV) {
                // console.error('🔄 Error de red HLS, intentando recuperar...')
              }
              try {
                hlsInstance.startLoad()
              } catch {
                if (import.meta.env.DEV) {
                  // console.error('❌ No se pudo recuperar, recargando stream...')
                }
                setTimeout(() => {
                  if (hlsInstance && videoRef.current) {
                    hlsInstance.loadSource(streamUrl)
                    hlsInstance.startLoad()
                  }
                }, 1000)
              }
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (import.meta.env.DEV) {
                // console.error('🔄 Error de media HLS, intentando recuperar...')
              }
              try {
                hlsInstance.recoverMediaError()
              } catch {
                if (import.meta.env.DEV) {
                  // console.error('❌ No se pudo recuperar error de media')
                }
                // Intentar recargar completamente
                setTimeout(() => {
                  if (hlsInstance && videoRef.current) {
                    hlsInstance.loadSource(streamUrl)
                    hlsInstance.startLoad()
                  }
                }, 1000)
              }
              break
            default:
              if (import.meta.env.DEV) {
                // console.error('❌ Error fatal HLS desconocido')
              }
              // Intentar recargar como último recurso
              setTimeout(() => {
                if (hlsInstance && videoRef.current) {
                  hlsInstance.loadSource(streamUrl)
                  hlsInstance.startLoad()
                }
              }, 2000)
              break
          }
        })
        
        // Listener para detectar cuando el buffer se está quedando sin datos
        hlsInstance.on(Hls.Events.BUFFER_APPENDING, () => {
          // Log silencioso - solo para debugging si es necesario
        })
        
        // Listener para detectar cuando el buffer está bajo
        hlsInstance.on(Hls.Events.BUFFER_RESET, () => {
          if (import.meta.env.DEV) {
            // console.warn('⚠️ Buffer reseteado, puede haber interrupciones')
          }
        })
        
        // Guardar referencia para limpiar después
        video._hls = hlsInstance
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari soporta HLS nativamente
        // console.log('✅ Safari detectado, usando HLS nativo')
        video.src = streamUrl
      } else {
        // console.error('❌ HLS no soportado en este navegador')
        toastRef.current({
          title: 'Navegador no compatible',
          description: 'Tu navegador no soporta HLS. Usa Chrome, Firefox o Edge.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    
    // Iniciar después de un pequeño delay para asegurar que el DOM esté listo
    timer = setTimeout(initHLS, 100)
    
    // Limpiar al desmontar o cambiar streamUrl
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      // Usar la referencia capturada al inicio del efecto
      const currentVideo = videoElement
      const currentHlsInstance = hlsInstance
      
      if (currentVideo && currentVideo._hls) {
        if (import.meta.env.DEV) {
          // console.log('🧹 Limpiando instancia HLS')
        }
        currentVideo._hls.destroy()
        currentVideo._hls = null
      }
      if (currentHlsInstance) {
        currentHlsInstance.destroy()
      }
    }
  }, [streamUrl, streamType])
  
  // Usar useRef para toast para evitar re-renders
  const toastRef = useRef(toast)
  useEffect(() => {
    toastRef.current = toast
  }, [toast])

  // Handler de error del video (memoizado para evitar re-renders)
  const handleVideoError = useCallback((e) => {
    const video = e.target
    const error = video.error
    let errorMessage = 'Error desconocido al cargar el stream'
    
    if (error) {
      switch (error.code) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage = 'Carga del stream cancelada'
          break
        case 2: // MEDIA_ERR_NETWORK
          errorMessage = 'Error de red. Verifica que el servidor esté corriendo en http://localhost:8000'
          break
        case 3: // MEDIA_ERR_DECODE
          errorMessage = 'Error al decodificar el stream. Verifica que OBS esté transmitiendo'
          break
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage = 'Stream no disponible. Verifica que OBS esté transmitiendo y el servidor esté corriendo'
          break
        default:
          errorMessage = `Error ${error.code}: ${error.message || 'Error desconocido'}`
      }
    }
    
    if (import.meta.env.DEV) {
      // console.error('Error en el video:', {
      //   error,
      //   errorCode: error?.code,
      //   errorMessage: error?.message,
      //   networkState: video.networkState,
      //   readyState: video.readyState,
      //   src: streamUrl
      // })
    }
    
    toastRef.current({
      title: 'Error al cargar el stream',
      description: errorMessage,
      status: 'error',
      duration: 7000,
      isClosable: true,
    })
  }, [streamUrl])
  
  // Handlers memoizados para eventos del video (evitar re-renders)
  const handleCanPlay = useCallback(() => {
    // No hacer nada - solo para evitar que se recree la función
  }, [])
  
  const handleWaiting = useCallback(() => {
    // No hacer nada - solo para evitar que se recree la función
  }, [])
  
  const handleStalled = useCallback(() => {
    // No hacer nada - solo para evitar que se recree la función
  }, [])

  // Cargar comentarios (simulado por ahora)
  useEffect(() => {
    // Simular comentarios - en producción esto vendría del backend
    const mockComments = [
      {
        id: 1,
        user: 'María González',
        avatar: null,
        text: '¡Excelente programa! Me encanta la música que están pasando.',
        timestamp: new Date(Date.now() - 3600000),
        likes: 12,
      },
      {
        id: 2,
        user: 'Carlos Rodríguez',
        avatar: null,
        text: 'Sigan así, son los mejores de la ciudad! 🔥',
        timestamp: new Date(Date.now() - 7200000),
        likes: 8,
      },
      {
        id: 3,
        user: 'Ana Martínez',
        avatar: null,
        text: '¿Podrían pasar más música de los 80s?',
        timestamp: new Date(Date.now() - 10800000),
        likes: 5,
      },
    ]
    setComments(mockComments)
  }, [])
  
  const handleSubmitComment = useCallback(async () => {
    if (!newComment.trim()) {
      toastRef.current({
        title: 'Comentario vacío',
        description: 'Por favor escribe un comentario',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      return
    }
    
    setSubmittingComment(true)
    
    try {
      // Simular envío de comentario - en producción esto sería una llamada al backend
      const comment = {
        id: comments.length + 1,
        user: 'Usuario Anónimo', // En producción esto vendría del auth
        avatar: null,
        text: newComment,
        timestamp: new Date(),
        likes: 0,
      }
      
      setComments(prev => [comment, ...prev])
      setNewComment('')
      
      toastRef.current({
        title: 'Comentario publicado',
        description: 'Tu comentario ha sido publicado exitosamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch {
      toastRef.current({
        title: 'Error',
        description: 'No se pudo publicar el comentario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSubmittingComment(false)
    }
  }, [newComment, comments.length])
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  const formatTime = (dateString) => {
    if (!dateString) return 'Hora no disponible'
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  if (loading) {
    return (
      <PublicLayout>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color={brandRed} thickness="4px" />
            <Text color="gray.500" fontSize="lg">Cargando programa...</Text>
          </VStack>
        </Box>
      </PublicLayout>
    )
  }
  
  if (!program) {
    return (
      <PublicLayout>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Text fontSize="2xl" color="gray.500">Programa no encontrado</Text>
            <Button onClick={() => navigate('/')} colorScheme="red">
              Volver al inicio
            </Button>
          </VStack>
        </Box>
      </PublicLayout>
    )
  }
  
  const programImage = program.program_image
    ? `http://localhost:3000/uploads/programs/${program.program_image}`
    : null
  
  return (
    <PublicLayout>
      <Box
        minH="100vh"
        bgGradient={`linear(135deg, ${brandRed}15, ${brandOrange}10, ${brandRed}15)`}
        pb={20}
      >
        {/* Header con botón de regreso */}
        <Box
          position="relative"
          bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
          py={8}
          mb={8}
        >
          <Container maxW="container.xl">
            <HStack spacing={4} mb={4}>
              <IconButton
                aria-label="Volver"
                icon={<Icon as={FiArrowLeft} />}
                onClick={() => navigate('/')}
                bg="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(10px)"
                color={brandWhite}
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.1)',
                }}
                borderRadius="full"
                size="md"
              />
              <Badge
                bg={brandWhite}
                color={brandRed}
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                sx={{
                  animation: `${pulse} 2s ease-in-out infinite`,
                }}
              >
                🔴 EN VIVO
              </Badge>
            </HStack>
          </Container>
        </Box>
        
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Información principal del programa */}
            <Card
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.2)"
              overflow="hidden"
              sx={{
                animation: `${slideIn} 0.6s ease-out`,
              }}
            >
              <Box
                position="relative"
                h={{ base: '300px', md: '400px', lg: '500px' }}
                bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                overflow="hidden"
              >
                {programImage ? (
                  <Image
                    src={programImage}
                    alt={program.program_title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiRadio} boxSize={32} color={brandWhite} opacity={0.3} />
                  </Box>
                )}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient="linear(to-b, transparent, rgba(0,0,0,0.7))"
                />
                <VStack
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  p={8}
                  align="start"
                  spacing={4}
                >
                  <Heading
                    size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                    color={brandWhite}
                    textShadow="0 2px 20px rgba(0,0,0,0.5)"
                  >
                    {program.program_title || 'Programa de Radio'}
                  </Heading>
                  {program.program_description && (
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      color={brandWhite}
                      noOfLines={3}
                      textShadow="0 1px 10px rgba(0,0,0,0.5)"
                    >
                      {program.program_description}
                    </Text>
                  )}
                </VStack>
              </Box>
              
              <CardBody p={{ base: 6, md: 8 }}>
                <VStack spacing={6} align="stretch">
                  {/* Información del programa */}
                  <HStack
                    spacing={{ base: 4, md: 8 }}
                    flexWrap="wrap"
                    justify="center"
                  >
                    {program.scheduled_date && (
                      <HStack spacing={2}>
                        <Icon as={FiCalendar} color={brandRed} boxSize={5} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500" fontWeight="bold">
                            FECHA
                          </Text>
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
                            {formatDate(program.scheduled_date)}
                          </Text>
                        </VStack>
                      </HStack>
                    )}
                    {program.scheduled_date && (
                      <HStack spacing={2}>
                        <Icon as={FiClock} color={brandOrange} boxSize={5} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500" fontWeight="bold">
                            HORA
                          </Text>
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
                            {formatTime(program.scheduled_date)}
                          </Text>
                        </VStack>
                      </HStack>
                    )}
                    <HStack spacing={2}>
                      <Icon as={FiUsers} color={brandRed} boxSize={5} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500" fontWeight="bold">
                          OYENTES
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                          1,247
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                  
                  <Divider />
                  
                  {/* Botones de acción */}
                  <HStack spacing={4} justify="center" flexWrap="wrap">
                    <Button
                      leftIcon={<Icon as={FiHeart} />}
                      bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                      color={brandWhite}
                      _hover={{
                        bgGradient: `linear(135deg, #C00000, #A00000)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 25px ${brandRed}60`,
                      }}
                      size="lg"
                      borderRadius="xl"
                    >
                      Me gusta
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiShare2} />}
                      bg="gray.100"
                      color="gray.700"
                      _hover={{
                        bg: 'gray.200',
                        transform: 'translateY(-2px)',
                      }}
                      size="lg"
                      borderRadius="xl"
                    >
                      Compartir
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Sección de transmisión en vivo */}
            <Card
                bg="rgba(255, 255, 255, 0.95)"
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                boxShadow="0 20px 60px rgba(0, 0, 0, 0.2)"
                overflow="hidden"
                sx={{
                  animation: `${slideIn} 0.7s ease-out`,
                }}
              >
                <CardBody p={0}>
                  <VStack spacing={0} align="stretch">
                    {/* Header de la transmisión */}
                    <Box
                      bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                      p={6}
                    >
                      <HStack justify="space-between" align="center" flexWrap="wrap">
                        <HStack spacing={3}>
                          <Icon as={FiVideo} boxSize={6} color={brandWhite} />
                          <VStack align="start" spacing={0}>
                            <Heading size="lg" color={brandWhite}>
                              Transmisión en Vivo
                            </Heading>
                            <Text fontSize="sm" color={brandWhite} opacity={0.9}>
                              Mira la transmisión en tiempo real
                            </Text>
                          </VStack>
                        </HStack>
                        <Badge
                          bg={brandWhite}
                          color={brandRed}
                          px={4}
                          py={2}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="bold"
                          sx={{
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }}
                        >
                          🔴 EN VIVO
                        </Badge>
                      </HStack>
                    </Box>
                    
                    {/* Reproductor de video */}
                    <Box
                      position="relative"
                      bg="black"
                      w="100%"
                      minH={{ base: '300px', md: '400px', lg: '500px' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                    {streamUrl ? (
                      <>
                        {streamType === 'hls' ? (
                          <Box
                            as="video"
                            ref={videoRef}
                            w="100%"
                            h="100%"
                            controls
                            autoPlay
                            playsInline
                            muted={false}
                            onError={handleVideoError}
                            onCanPlay={handleCanPlay}
                            onWaiting={handleWaiting}
                            onStalled={handleStalled}
                            sx={{
                              '&::-webkit-media-controls-panel': {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              },
                            }}
                          >
                            {/* No usar <source> cuando usamos HLS.js, se maneja en el useEffect */}
                            Tu navegador no soporta la reproducción de video HLS.
                            <Text color="white" p={4} fontSize="sm">
                              Si el video no se muestra, verifica la consola del navegador (F12) para más detalles.
                              <br />
                              URL: {streamUrl}
                            </Text>
                          </Box>
                        ) : streamType === 'youtube' ? (
                          <Box
                            w="100%"
                            h={{ base: '300px', md: '400px', lg: '500px' }}
                            position="relative"
                          >
                            <Box
                              as="iframe"
                              src={streamUrl}
                              w="100%"
                              h="100%"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{
                                border: 'none',
                                borderRadius: '0',
                              }}
                            />
                          </Box>
                        ) : streamType === 'rtmp' ? (
                          <VStack spacing={4} p={8} color="white">
                            <Icon as={FiVideo} boxSize={16} opacity={0.5} />
                            <Text fontSize="lg" textAlign="center">
                              RTMP requiere un reproductor especializado
                            </Text>
                            <Text fontSize="sm" opacity={0.7} textAlign="center">
                              Considera usar HLS o YouTube Live para mejor compatibilidad
                            </Text>
                          </VStack>
                        ) : (
                          <VStack spacing={4} p={8} color="white">
                            <Icon as={FiVideo} boxSize={16} opacity={0.5} />
                            <Text fontSize="lg" textAlign="center">
                              Configura la URL de transmisión
                            </Text>
                            <Text fontSize="sm" opacity={0.7} textAlign="center" maxW="500px">
                              Para configurar OBS Studio, consulta las instrucciones más abajo
                            </Text>
                          </VStack>
                        )}
                        
                        {/* Botón de pantalla completa */}
                        <IconButton
                          aria-label="Pantalla completa"
                          icon={<Icon as={FiMaximize2} />}
                          position="absolute"
                          top={4}
                          right={4}
                          bg="rgba(0, 0, 0, 0.6)"
                          backdropFilter="blur(10px)"
                          color={brandWhite}
                          _hover={{
                            bg: 'rgba(0, 0, 0, 0.8)',
                            transform: 'scale(1.1)',
                          }}
                          onClick={() => {
                            if (videoRef.current) {
                              if (videoRef.current.requestFullscreen) {
                                videoRef.current.requestFullscreen()
                              } else if (videoRef.current.webkitRequestFullscreen) {
                                videoRef.current.webkitRequestFullscreen()
                              } else if (videoRef.current.mozRequestFullScreen) {
                                videoRef.current.mozRequestFullScreen()
                              }
                            }
                          }}
                          borderRadius="md"
                        />
                      </>
                    ) : (
                      <VStack spacing={6} p={8} color="white">
                        <Icon as={FiVideo} boxSize={20} opacity={0.5} />
                        <VStack spacing={2} textAlign="center">
                          <Text fontSize="xl" fontWeight="bold">
                            Transmisión no configurada
                          </Text>
                          <Text fontSize="sm" opacity={0.7} maxW="500px">
                            Configura OBS Studio y la URL de transmisión para ver la transmisión en vivo
                          </Text>
                        </VStack>
                        
                        {/* Instrucciones rápidas */}
                        <Box
                          bg="rgba(255, 255, 255, 0.1)"
                          backdropFilter="blur(10px)"
                          p={6}
                          borderRadius="xl"
                          maxW="600px"
                          w="100%"
                        >
                          <VStack spacing={4} align="stretch">
                            <HStack spacing={2}>
                              <Icon as={FiSettings} boxSize={5} />
                              <Text fontWeight="bold" fontSize="md">
                                Configuración rápida de OBS Studio
                              </Text>
                            </HStack>
                            <VStack align="stretch" spacing={2} fontSize="sm" pl={7}>
                              <Text>1. Abre OBS Studio</Text>
                              <Text>2. Ve a Configuración → Transmisión</Text>
                              <Text>3. Servicio: Personalizado</Text>
                              <Text>4. Servidor: rtmp://tu-servidor/live</Text>
                              <Text>5. Clave de transmisión: tu-clave</Text>
                              <Text>6. Haz clic en "Iniciar transmisión"</Text>
                            </VStack>
                            <Text fontSize="xs" opacity={0.8} pl={7} mt={2}>
                              Para pruebas locales, puedes usar un servidor RTMP local o configurar HLS
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    )}
                  </Box>
                  
                  {/* Información y controles adicionales */}
                  {streamUrl && (
                    <Box p={6} bg="gray.50">
                      <HStack spacing={4} flexWrap="wrap" justify="space-between">
                        <HStack spacing={4}>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" fontWeight="bold">
                              TIPO DE STREAM
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="gray.700">
                              {streamType.toUpperCase()}
                            </Text>
                          </VStack>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500" fontWeight="bold">
                              ESTADO
                            </Text>
                            <Badge
                              bg={brandRed}
                              color={brandWhite}
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                            >
                              EN VIVO
                            </Badge>
                          </VStack>
                        </HStack>
                        <Button
                          leftIcon={<Icon as={FiShare2} />}
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            toast({
                              title: 'Enlace copiado',
                              description: 'El enlace de la transmisión ha sido copiado',
                              status: 'success',
                              duration: 2000,
                              isClosable: true,
                            })
                          }}
                        >
                          Compartir transmisión
                        </Button>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
            
            {/* Sección de comentarios */}
            <Card
              bg="rgba(255, 255, 255, 0.95)"
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.2)"
              sx={{
                animation: `${slideIn} 0.8s ease-out`,
              }}
            >
              <CardBody p={{ base: 6, md: 8 }}>
                <VStack spacing={6} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={FiMessageCircle} boxSize={6} color={brandRed} />
                    <Heading size="lg" color="gray.700">
                      Comentarios
                    </Heading>
                    <Badge
                      bg={brandRed}
                      color={brandWhite}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {comments.length}
                    </Badge>
                  </HStack>
                  
                  <Divider />
                  
                  {/* Formulario de nuevo comentario */}
                  <Box
                    bg="gray.50"
                    p={6}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4} align="stretch">
                      <Textarea
                        placeholder="Escribe tu comentario aquí..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        resize="none"
                        borderRadius="lg"
                        border="2px solid"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: brandRed,
                          boxShadow: `0 0 0 1px ${brandRed}`,
                        }}
                        fontSize="md"
                      />
                      <HStack justify="flex-end">
                        <Button
                          leftIcon={<Icon as={FiSend} />}
                          bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                          color={brandWhite}
                          _hover={{
                            bgGradient: `linear(135deg, #C00000, #FF8C00)`,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 10px 25px ${brandRed}60`,
                          }}
                          onClick={handleSubmitComment}
                          isLoading={submittingComment}
                          loadingText="Publicando..."
                          size="lg"
                          borderRadius="xl"
                        >
                          Publicar comentario
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                  
                  <Divider />
                  
                  {/* Lista de comentarios */}
                  <VStack spacing={4} align="stretch">
                    {comments.length === 0 ? (
                      <Box textAlign="center" py={8}>
                        <Text color="gray.500" fontSize="lg">
                          No hay comentarios aún. ¡Sé el primero en comentar!
                        </Text>
                      </Box>
                    ) : (
                      comments.map((comment) => (
                        <Card
                          key={comment.id}
                          bg="white"
                          borderRadius="xl"
                          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                          _hover={{
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                            transform: 'translateY(-2px)',
                          }}
                          transition="all 0.3s ease"
                        >
                          <CardBody p={6}>
                            <VStack align="stretch" spacing={4}>
                              <HStack justify="space-between" align="start">
                                <HStack spacing={3}>
                                  <Avatar
                                    size="md"
                                    bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                                    icon={<Icon as={FiUser} boxSize={5} />}
                                  />
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold" color="gray.700" fontSize="md">
                                      {comment.user}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {comment.timestamp.toLocaleString('es-ES', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </Text>
                                  </VStack>
                                </HStack>
                                <Tooltip label="Me gusta" placement="top">
                                  <IconButton
                                    aria-label="Me gusta"
                                    icon={<Icon as={FiHeart} />}
                                    variant="ghost"
                                    color="gray.500"
                                    size="sm"
                                    _hover={{
                                      color: brandRed,
                                      transform: 'scale(1.2)',
                                    }}
                                  />
                                </Tooltip>
                              </HStack>
                              <Text color="gray.700" fontSize="md" lineHeight="tall">
                                {comment.text}
                              </Text>
                              <HStack spacing={4}>
                                <HStack spacing={1}>
                                  <Icon as={FiHeart} boxSize={4} color={brandRed} />
                                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                    {comment.likes}
                                  </Text>
                                </HStack>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))
                    )}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
      <PublicFooter />
    </PublicLayout>
  )
}

export default ProgramView

