import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Heading,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useDisclosure,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Icon,
  Flex,
  Tooltip,
  Progress
} from '@chakra-ui/react'
import { FiSave, FiMenu, FiHome, FiLogOut, FiArrowLeft, FiRadio, FiClock, FiUsers, FiCalendar, FiPlus, FiX, FiFilter, FiGrid, FiList, FiCalendar as FiCalendarIcon } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import { canEdit, getUserRoleInfo } from '../../utils/roleUtils'
import axios from 'axios'

const Programs = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  // Estados
  const [submitting, setSubmitting] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingPodcasts, setLoadingPodcasts] = useState(false)
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [users, setUsers] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [filterType, setFilterType] = useState('all') // 'all', 'tiktok_live', 'instagram_live', 'podcast'

  const [formData, setFormData] = useState({
    program_title: '',
    program_description: '',
    program_type: '',
    tiktok_live_url: '',
    instagram_live_url: '',
    podcast_id: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 60,
    program_users: []
  })

  // Verificar permisos
  const hasEditPermission = canEdit(auth)
  const roleInfo = getUserRoleInfo(auth)

  // Generar slots de tiempo de 5:00 AM a 8:00 PM (cada 30 minutos)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 5; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time: timeString,
          hour,
          minute,
          totalMinutes: hour * 60 + minute
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Obtener semana actual (lunes a domingo)
  const getWeekDates = () => {
    const today = new Date(selectedDate)
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Ajustar para que lunes sea el primer día
    const monday = new Date(today.setDate(diff))
    
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      week.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase(),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'short' })
      })
    }
    return week
  }

  const weekDates = getWeekDates()

  // Cargar programas para la semana
  const fetchPrograms = useCallback(async () => {
    setLoadingPrograms(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get('/api/programs/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const programsData = response.data?.data || response.data || []
      setPrograms(Array.isArray(programsData) ? programsData : [])
    } catch (error) {
      console.error('Error fetching programs:', error)
      setPrograms([])
    } finally {
      setLoadingPrograms(false)
    }
  }, [])

  // Cargar usuarios disponibles
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get('/api/register', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const usersData = response.data?.data || response.data || []
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }, [toast])

  // Cargar podcasts disponibles
  const fetchPodcasts = useCallback(async () => {
    setLoadingPodcasts(true)
    try {
      const response = await axios.get('/api/podcasts/all')
      const podcastsData = response.data?.data || response.data || []
      setPodcasts(Array.isArray(podcastsData) ? podcastsData : [])
    } catch (error) {
      console.error('Error fetching podcasts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los podcasts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setPodcasts([])
    } finally {
      setLoadingPodcasts(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
    fetchPodcasts()
  }, [fetchUsers, fetchPodcasts])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  // Obtener programas para un día específico
  const getProgramsForDay = (date) => {
    return programs.filter(program => {
      const programDate = new Date(program.scheduled_date).toISOString().split('T')[0]
      return programDate === date && (filterType === 'all' || program.program_type === filterType)
    }).sort((a, b) => {
      const timeA = new Date(a.scheduled_date)
      const timeB = new Date(b.scheduled_date)
      return timeA - timeB
    })
  }

  // Verificar si un slot está ocupado para un día específico
  const isSlotOccupied = (slot, date) => {
    return programs.some(program => {
      const programDate = new Date(program.scheduled_date).toISOString().split('T')[0]
      if (programDate !== date) return false
      if (filterType !== 'all' && program.program_type !== filterType) return false
      
      const programTime = new Date(program.scheduled_date)
      const programHour = programTime.getHours()
      const programMinute = programTime.getMinutes()
      const programStartMinutes = programHour * 60 + programMinute
      const programEndMinutes = programStartMinutes + (program.duration_minutes || 60)
      const slotMinutes = slot.totalMinutes
      
      return slotMinutes >= programStartMinutes && slotMinutes < programEndMinutes
    })
  }

  // Obtener programa en un slot para un día específico
  const getProgramAtSlot = (slot, date) => {
    return programs.find(program => {
      const programDate = new Date(program.scheduled_date).toISOString().split('T')[0]
      if (programDate !== date) return false
      if (filterType !== 'all' && program.program_type !== filterType) return false
      
      const programTime = new Date(program.scheduled_date)
      const programHour = programTime.getHours()
      const programMinute = programTime.getMinutes()
      const programStartMinutes = programHour * 60 + programMinute
      const slotMinutes = slot.totalMinutes
      
      return slotMinutes === programStartMinutes
    })
  }

  // Formatear hora
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  // Obtener color según tipo de programa
  const getTypeColor = (type) => {
    switch(type) {
      case 'tiktok_live': return 'blue'
      case 'instagram_live': return 'pink'
      case 'podcast': return 'purple'
      default: return 'gray'
    }
  }

  // Obtener icono según tipo
  const getTypeIcon = (type) => {
    switch(type) {
      case 'tiktok_live': return '🎵'
      case 'instagram_live': return '📷'
      case 'podcast': return '🎙️'
      default: return '📻'
    }
  }


  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleUserSelection = (userId) => {
    setFormData(prev => {
      const currentUsers = prev.program_users || []
      const isSelected = currentUsers.includes(userId)
      
      if (isSelected) {
        return {
          ...prev,
          program_users: currentUsers.filter(id => id !== userId)
        }
      } else {
        return {
          ...prev,
          program_users: [...currentUsers, userId]
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.program_title.trim()) {
      toast({
        title: 'Error',
        description: 'El título del programa es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (formData.program_title.length < 3) {
      toast({
        title: 'Error',
        description: 'El título debe tener al menos 3 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.program_type) {
      toast({
        title: 'Error',
        description: 'El tipo de programa es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.duration_minutes || formData.duration_minutes < 60 || formData.duration_minutes > 120) {
      toast({
        title: 'Error',
        description: 'La duración debe estar entre 60 y 120 minutos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (formData.program_type === 'tiktok_live' && !formData.tiktok_live_url.trim()) {
      toast({
        title: 'Error',
        description: 'La URL de TikTok Live es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (formData.program_type === 'instagram_live' && !formData.instagram_live_url.trim()) {
      toast({
        title: 'Error',
        description: 'La URL de Instagram Live es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (formData.program_type === 'podcast' && !formData.podcast_id) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un podcast',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.program_users || formData.program_users.length === 0) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar al menos un usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setSubmitting(true)
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString()
      
      const programData = {
        program_title: formData.program_title.trim(),
        program_description: formData.program_description.trim() || null,
        program_type: formData.program_type,
        scheduled_date: scheduledDateTime,
        duration_minutes: formData.duration_minutes,
        program_users: formData.program_users.map(userId => ({
          user_id: userId,
          user_role: 'locutor'
        }))
      }

      if (formData.program_type === 'tiktok_live') {
        programData.tiktok_live_url = formData.tiktok_live_url.trim()
      } else if (formData.program_type === 'instagram_live') {
        programData.instagram_live_url = formData.instagram_live_url.trim()
      } else if (formData.program_type === 'podcast') {
        programData.podcast_id = parseInt(formData.podcast_id)
      }

      const response = await axios.post('/api/programs/create', programData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        toast({
          title: 'Programa creado',
          description: 'El programa ha sido creado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Limpiar formulario y cerrar modal
        setFormData({
          program_title: '',
          program_description: '',
          program_type: '',
          tiktok_live_url: '',
          instagram_live_url: '',
          podcast_id: '',
          scheduled_date: selectedDate,
          scheduled_time: '',
          duration_minutes: 60,
          program_users: []
        })
        setSelectedTimeSlot(null)
        onModalClose()
        fetchPrograms()
      } else {
        throw new Error(response.data.message || 'Error al crear el programa')
      }
    } catch (error) {
      console.error('Error creating program:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo crear el programa',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!hasEditPermission) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" maxW="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Acceso Denegado</AlertTitle>
            <AlertDescription>
              No tienes permisos para crear programas. Se requiere rol de editor o superior.
              <br />
              <Text fontSize="sm" mt={2}>
                Tu rol actual: {roleInfo.name} (ID: {roleInfo.id})
              </Text>
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/dashboard/admin"
                    leftIcon={<FiArrowLeft />}
                    variant="outline"
                    size="sm"
                  >
                    Volver
                  </Button>
                  <Heading size="lg" color="red.600">
                    Programación de Programas
                  </Heading>
                  <Badge colorScheme="green" variant="solid" fontSize="sm">
                    {roleInfo.name.toUpperCase()}
                  </Badge>
                </HStack>
                <Text color={textColor}>
                  Visualiza y crea programas en la línea de tiempo
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<FiMenu />} onClick={onOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<FiHome />} />
                <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Menú administrativo */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/programs"
          />

          {/* Header de la programación semanal */}
          <Card bg={cardBg} boxShadow="lg">
            <CardHeader bg="red.500" color="white">
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Heading size="lg">
                    Programación Semanal de Radio
                  </Heading>
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      size="md"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          scheduled_date: selectedDate
                        }))
                        onModalOpen()
                      }}
                    >
                      + Nuevo Programa
                    </Button>
                  </HStack>
                </HStack>
                <HStack justify="space-between" flexWrap="wrap" spacing={4}>
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="semibold">
                      {weekDates[0].dayNumber} - {weekDates[6].dayNumber} de {weekDates[0].month} {new Date(selectedDate).getFullYear()}
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      size="sm"
                      bg="white"
                      color="gray.700"
                      maxW="200px"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="tiktok_live">🎵 TikTok Live</option>
                      <option value="instagram_live">📷 Instagram Live</option>
                      <option value="podcast">🎙️ Podcast</option>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() - 7)
                        setSelectedDate(newDate.toISOString().split('T')[0])
                      }}
                    >
                      ← Semana Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() + 7)
                        setSelectedDate(newDate.toISOString().split('T')[0])
                      }}
                    >
                      Semana Siguiente →
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </CardHeader>
            <CardBody p={0}>
              {loadingPrograms ? (
                <Flex justify="center" py={12}>
                  <Spinner size="xl" color="red.500" />
                </Flex>
              ) : (
                <Box overflowX="auto">
                  {/* Grid semanal */}
                  <Grid templateColumns="120px repeat(7, 1fr)" gap={0} minW="1400px">
                    {/* Columna de horas */}
                    <Box bg="gray.50" borderRight="2px solid" borderColor="gray.200" position="sticky" left={0} zIndex={10}>
                      <Box h="60px" borderBottom="1px solid" borderColor="gray.200" />
                      {timeSlots.map((slot, idx) => (
                        <Box
                          key={idx}
                          h="60px"
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          p={2}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="xs" fontWeight="bold" color="gray.600">
                            {slot.time}
                          </Text>
                        </Box>
                      ))}
                    </Box>

                    {/* Columnas de días */}
                    {weekDates.map((day, dayIdx) => {
                      const dayPrograms = getProgramsForDay(day.date)
                      
                      return (
                        <Box
                          key={dayIdx}
                          borderRight={dayIdx < 6 ? "1px solid" : "none"}
                          borderColor="gray.200"
                          position="relative"
                        >
                          {/* Header del día */}
                          <Box
                            h="60px"
                            bg="gray.100"
                            borderBottom="2px solid"
                            borderColor="gray.300"
                            p={2}
                            textAlign="center"
                            position="sticky"
                            top={0}
                            zIndex={5}
                          >
                            <Text fontWeight="bold" fontSize="sm" color="gray.700">
                              {day.dayName}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {day.dayNumber} {day.month}
                            </Text>
                          </Box>

                          {/* Contenedor de programas */}
                          <Box position="relative" minH={`${timeSlots.length * 60}px`}>
                            {/* Renderizar programas */}
                            {dayPrograms.map((program, progIdx) => {
                              const programTime = new Date(program.scheduled_date)
                              const programHour = programTime.getHours()
                              const programMinute = programTime.getMinutes()
                              const programStartMinutes = programHour * 60 + programMinute
                              const startSlot = timeSlots.findIndex(slot => slot.totalMinutes === programStartMinutes)
                              const durationSlots = Math.ceil((program.duration_minutes || 60) / 30)
                              const topPosition = startSlot * 60
                              const height = durationSlots * 60

                              return (
                                <Box
                                  key={progIdx}
                                  position="absolute"
                                  top={`${topPosition}px`}
                                  left="4px"
                                  right="4px"
                                  h={`${height}px`}
                                  bg="white"
                                  borderRadius="md"
                                  boxShadow="sm"
                                  border="2px solid"
                                  borderColor={`${getTypeColor(program.program_type)}.400`}
                                  p={2}
                                  cursor="pointer"
                                  _hover={{
                                    boxShadow: "md",
                                    transform: "translateY(-2px)"
                                  }}
                                  transition="all 0.2s"
                                  onClick={() => {
                                    // Puedes agregar funcionalidad para editar aquí
                                  }}
                                >
                                  <VStack align="start" spacing={1} h="100%">
                                    <HStack spacing={1}>
                                      <Text fontSize="lg">{getTypeIcon(program.program_type)}</Text>
                                      <Badge
                                        colorScheme={getTypeColor(program.program_type)}
                                        fontSize="xs"
                                        borderRadius="full"
                                      >
                                        {(program.duration_minutes || 60) / 60}h
                                      </Badge>
                                    </HStack>
                                    <Text
                                      fontSize="xs"
                                      fontWeight="bold"
                                      noOfLines={2}
                                      flex={1}
                                    >
                                      {program.program_title}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {formatTime(program.scheduled_date)} - {(() => {
                                        const endTime = new Date(program.scheduled_date)
                                        endTime.setMinutes(endTime.getMinutes() + (program.duration_minutes || 60))
                                        return formatTime(endTime.toISOString())
                                      })()}
                                    </Text>
                                  </VStack>
                                </Box>
                              )
                            })}

                            {/* Renderizar espacios libres */}
                            {timeSlots.map((slot, slotIdx) => {
                              const isOccupied = isSlotOccupied(slot, day.date)
                              const program = getProgramAtSlot(slot, day.date)
                              
                              if (isOccupied && program) {
                                // Si hay un programa que empieza aquí, no mostrar espacio libre
                                const programTime = new Date(program.scheduled_date)
                                const programHour = programTime.getHours()
                                const programMinute = programTime.getMinutes()
                                const programStartMinutes = programHour * 60 + programMinute
                                if (slot.totalMinutes === programStartMinutes) {
                                  return null
                                }
                              }

                              if (!isOccupied) {
                                return (
                                  <Box
                                    key={slotIdx}
                                    position="absolute"
                                    top={`${slotIdx * 60}px`}
                                    left="4px"
                                    right="4px"
                                    h="60px"
                                    border="2px dashed"
                                    borderColor="green.300"
                                    borderRadius="md"
                                    bg="green.50"
                                    p={2}
                                    cursor="pointer"
                                    _hover={{
                                      bg: "green.100",
                                      borderColor: "green.400"
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => {
                                      setSelectedTimeSlot(slot)
                                      setFormData(prev => ({
                                        ...prev,
                                        scheduled_date: day.date,
                                        scheduled_time: slot.time
                                      }))
                                      onModalOpen()
                                    }}
                                  >
                                    <VStack align="start" spacing={0} h="100%" justify="center">
                                      <Text fontSize="xs" fontWeight="semibold" color="green.600">
                                        Espacio Libre
                                      </Text>
                                      <Text fontSize="xs" color="green.500">
                                        {slot.time} - {(() => {
                                          const nextSlot = timeSlots[slotIdx + 1]
                                          return nextSlot ? nextSlot.time : '8:00 PM'
                                        })()}
                                      </Text>
                                      <Text fontSize="xs" color="green.400">
                                        30 min
                                      </Text>
                                    </VStack>
                                  </Box>
                                )
                              }
                              return null
                            })}
                          </Box>
                        </Box>
                      )
                    })}
                  </Grid>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal para crear programa */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl" scrollBehavior="inside" isCentered>
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader bg="red.500" color="white" position="sticky" top={0} zIndex={1}>
            <HStack spacing={2}>
              <Icon as={FiPlus} />
              <Text>Crear Nuevo Programa</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSubmit}>
            <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
              <VStack spacing={4} align="stretch" pt={4}>
                {/* Información del horario seleccionado */}
                {selectedTimeSlot && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Horario Seleccionado</AlertTitle>
                      <AlertDescription fontSize="sm">
                        {new Date(selectedDate).toLocaleDateString('es-ES')} a las {selectedTimeSlot.time}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* Título */}
                <FormControl isRequired>
                  <FormLabel>Título del Programa</FormLabel>
                  <Input
                    name="program_title"
                    value={formData.program_title}
                    onChange={handleInputChange}
                    placeholder="Ej: Programa Matutino"
                    focusBorderColor="red.500"
                  />
                </FormControl>

                {/* Descripción */}
                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    name="program_description"
                    value={formData.program_description}
                    onChange={handleInputChange}
                    placeholder="Descripción opcional..."
                    rows={3}
                    focusBorderColor="red.500"
                  />
                </FormControl>

                {/* Tipo */}
                <FormControl isRequired>
                  <FormLabel>Tipo de Programa</FormLabel>
                  <Select
                    name="program_type"
                    value={formData.program_type}
                    onChange={handleInputChange}
                    placeholder="Selecciona el tipo"
                    focusBorderColor="red.500"
                  >
                    <option value="tiktok_live">🎵 TikTok Live</option>
                    <option value="instagram_live">📷 Instagram Live</option>
                    <option value="podcast">🎙️ Podcast</option>
                  </Select>
                </FormControl>

                {/* URL de TikTok Live */}
                {formData.program_type === 'tiktok_live' && (
                  <FormControl isRequired>
                    <FormLabel>URL de TikTok Live</FormLabel>
                    <Input
                      name="tiktok_live_url"
                      value={formData.tiktok_live_url}
                      onChange={handleInputChange}
                      placeholder="https://www.tiktok.com/@usuario/live"
                      type="url"
                      focusBorderColor="red.500"
                    />
                  </FormControl>
                )}

                {/* URL de Instagram Live */}
                {formData.program_type === 'instagram_live' && (
                  <FormControl isRequired>
                    <FormLabel>URL de Instagram Live</FormLabel>
                    <Input
                      name="instagram_live_url"
                      value={formData.instagram_live_url}
                      onChange={handleInputChange}
                      placeholder="https://www.instagram.com/usuario/live"
                      type="url"
                      focusBorderColor="red.500"
                    />
                  </FormControl>
                )}

                {/* Podcast */}
                {formData.program_type === 'podcast' && (
                  <FormControl isRequired>
                    <FormLabel>Podcast</FormLabel>
                    <Select
                      name="podcast_id"
                      value={formData.podcast_id}
                      onChange={handleInputChange}
                      placeholder="Selecciona un podcast"
                      isDisabled={loadingPodcasts}
                      focusBorderColor="red.500"
                    >
                      {podcasts.map((podcast) => (
                        <option key={podcast.podcast_id} value={podcast.podcast_id}>
                          {podcast.podcast_title || podcast.title}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Duración */}
                <FormControl isRequired>
                  <FormLabel>Duración (minutos)</FormLabel>
                  <Input
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    type="number"
                    min={60}
                    max={120}
                    step={15}
                    focusBorderColor="red.500"
                  />
                  <FormHelperText>Entre 60 y 120 minutos</FormHelperText>
                </FormControl>

                {/* Usuarios */}
                <FormControl isRequired>
                  <FormLabel>Usuarios del Programa</FormLabel>
                  <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={3}
                    maxH="200px"
                    overflowY="auto"
                  >
                    {loadingUsers ? (
                      <Spinner size="sm" />
                    ) : (
                      <CheckboxGroup>
                        <SimpleGrid columns={2} spacing={2}>
                          {users.map((user) => (
                            <Checkbox
                              key={user.user_id}
                              isChecked={formData.program_users?.includes(user.user_id)}
                              onChange={() => handleUserSelection(user.user_id)}
                              value={user.user_id}
                              colorScheme="red"
                            >
                              <Text fontSize="sm">
                                {user.user_name || user.name} {user.user_lastname || user.lastname}
                              </Text>
                            </Checkbox>
                          ))}
                        </SimpleGrid>
                      </CheckboxGroup>
                    )}
                  </Box>
                  {formData.program_users.length > 0 && (
                    <FormHelperText>
                      {formData.program_users.length} usuario(s) seleccionado(s)
                    </FormHelperText>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onModalClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="red"
                leftIcon={<FiSave />}
                isLoading={submitting}
                loadingText="Creando..."
              >
                Crear Programa
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Programs
