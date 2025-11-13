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
  Progress,
  Image,
  Avatar,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import { FiSave, FiMenu, FiHome, FiLogOut, FiArrowLeft, FiRadio, FiClock, FiUsers, FiCalendar, FiPlus, FiX, FiFilter, FiGrid, FiList, FiCalendar as FiCalendarIcon, FiEdit2, FiTrash2 } from 'react-icons/fi'
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
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure()
  const [programToDelete, setProgramToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const cancelRef = React.useRef()

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
  const [editingProgramId, setEditingProgramId] = useState(null)

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
    program_users: [],
    program_image: null
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

  // Cargar usuarios disponibles (solo locutores)
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
      // Filtrar solo usuarios con rol de locutor
      const locutorUsers = Array.isArray(usersData) 
        ? usersData.filter(user => {
            // Verificar si el usuario tiene rol de locutor
            const userRole = user.user_role || user.role_name || user.role || ''
            return userRole.toLowerCase() === 'locutor'
          })
        : []
      setUsers(locutorUsers)
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        program_image: file
      }))
    }
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

  // Función para cargar datos del programa a editar
  const loadProgramForEdit = async (programId) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get(`/api/programs/${programId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success && response.data.data) {
        const program = response.data.data
        
        // Formatear fecha y hora
        const scheduledDate = new Date(program.scheduled_date)
        const dateStr = scheduledDate.toISOString().split('T')[0]
        const timeStr = scheduledDate.toTimeString().split(' ')[0].slice(0, 5)
        
        // Obtener IDs de usuarios del programa
        const programUserIds = program.program_users 
          ? program.program_users.map(pu => pu.user_id || pu.userId)
          : []

        setFormData({
          program_title: program.program_title || '',
          program_description: program.program_description || '',
          program_type: program.program_type || '',
          tiktok_live_url: program.tiktok_live_url || '',
          instagram_live_url: program.instagram_live_url || '',
          podcast_id: program.podcast_id || '',
          scheduled_date: dateStr,
          scheduled_time: timeStr,
          duration_minutes: program.duration_minutes || 60,
          program_users: programUserIds,
          program_image: program.program_image ? { name: program.program_image, isExisting: true } : null
        })

        setEditingProgramId(programId)
        setSelectedTimeSlot(null) // Limpiar slot seleccionado en modo edición
        onModalOpen()
      } else {
        throw new Error('No se pudo cargar el programa')
      }
    } catch (error) {
      console.error('Error loading program:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo cargar el programa',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Función para limpiar el formulario y cerrar modal
  const handleCloseModal = () => {
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
      program_users: [],
      program_image: null
    })
    setEditingProgramId(null)
    setSelectedTimeSlot(null)
    onModalClose()
  }

  // Función para abrir el diálogo de confirmación de eliminación
  const handleDeleteClick = (program, e) => {
    e.stopPropagation()
    setProgramToDelete(program)
    onDeleteDialogOpen()
  }

  // Función para eliminar un programa
  const handleDeleteProgram = async () => {
    if (!programToDelete) return

    setDeleting(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.delete(`/api/programs/${programToDelete.program_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        toast({
          title: 'Programa eliminado',
          description: `El programa "${programToDelete.program_title}" ha sido eliminado exitosamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Cerrar diálogo y limpiar
        onDeleteDialogClose()
        setProgramToDelete(null)
        
        // Actualizar la lista de programas
        fetchPrograms()
      } else {
        throw new Error(response.data.message || 'Error al eliminar el programa')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo eliminar el programa',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setDeleting(false)
    }
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
      
      // Validar que fecha y hora estén presentes
      if (!formData.scheduled_date || !formData.scheduled_time) {
        toast({
          title: 'Error',
          description: 'La fecha y hora programada son requeridas',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setSubmitting(false)
        return
      }

      // Crear fecha combinando fecha y hora
      const dateTimeString = `${formData.scheduled_date}T${formData.scheduled_time}`
      const scheduledDate = new Date(dateTimeString)
      
      // Validar que la fecha sea válida
      if (isNaN(scheduledDate.getTime())) {
        toast({
          title: 'Error',
          description: 'La fecha y hora seleccionadas no son válidas',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setSubmitting(false)
        return
      }
      
      const scheduledDateTime = scheduledDate.toISOString()
      
      // Si hay imagen nueva (File), usar FormData, sino JSON
      // Si program_image es un objeto con isExisting, no es un archivo nuevo, usar JSON
      const hasImage = formData.program_image && formData.program_image instanceof File
      
      let requestData
      let headers
      
      if (hasImage) {
        // Usar FormData para enviar con imagen
        const formDataToSend = new FormData()
        formDataToSend.append('program_title', formData.program_title.trim())
        formDataToSend.append('program_description', formData.program_description.trim() || '')
        formDataToSend.append('program_type', formData.program_type)
        formDataToSend.append('scheduled_date', scheduledDateTime)
        formDataToSend.append('duration_minutes', formData.duration_minutes)
        formDataToSend.append('program_users', JSON.stringify(formData.program_users.map(userId => ({
          user_id: userId,
          user_role: 'locutor'
        }))))
        formDataToSend.append('program_image', formData.program_image)

        // Agregar URLs según el tipo de programa
        if (formData.program_type === 'tiktok_live') {
          formDataToSend.append('tiktok_live_url', formData.tiktok_live_url.trim() || '')
          // No enviar otros tipos de URLs cuando es tiktok_live
        } else if (formData.program_type === 'instagram_live') {
          formDataToSend.append('instagram_live_url', formData.instagram_live_url.trim() || '')
          // No enviar otros tipos de URLs cuando es instagram_live
        } else if (formData.program_type === 'podcast') {
          formDataToSend.append('podcast_id', parseInt(formData.podcast_id) || '')
          // No enviar otros tipos de URLs cuando es podcast
        }

        requestData = formDataToSend
        headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      } else {
        // Usar JSON sin imagen
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

        // Si hay imagen existente pero no se seleccionó una nueva, mantener la existente
        if (formData.program_image && formData.program_image.isExisting && !(formData.program_image instanceof File)) {
          programData.program_image = formData.program_image.name
        }

        // Agregar URLs según el tipo de programa
        if (formData.program_type === 'tiktok_live') {
          programData.tiktok_live_url = formData.tiktok_live_url.trim() || null
          programData.instagram_live_url = null // Limpiar si cambió de tipo
          programData.podcast_id = null // Limpiar si cambió de tipo
        } else if (formData.program_type === 'instagram_live') {
          programData.instagram_live_url = formData.instagram_live_url.trim() || null
          programData.tiktok_live_url = null // Limpiar si cambió de tipo
          programData.podcast_id = null // Limpiar si cambió de tipo
        } else if (formData.program_type === 'podcast') {
          programData.podcast_id = parseInt(formData.podcast_id) || null
          programData.tiktok_live_url = null // Limpiar si cambió de tipo
          programData.instagram_live_url = null // Limpiar si cambió de tipo
        }

        requestData = programData
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      // Determinar si es creación o actualización
      const isEditing = editingProgramId !== null
      const url = isEditing 
        ? `/api/programs/${editingProgramId}`
        : '/api/programs/create'
      const method = isEditing ? 'put' : 'post'
      
      const response = await axios[method](url, requestData, {
        headers: headers
      })
      
      if (response.data.success) {
        toast({
          title: isEditing ? 'Programa actualizado' : 'Programa creado',
          description: isEditing 
            ? 'El programa ha sido actualizado exitosamente'
            : 'El programa ha sido creado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Limpiar formulario y cerrar modal
        handleCloseModal()
        fetchPrograms()
      } else {
        throw new Error(response.data.message || (isEditing ? 'Error al actualizar el programa' : 'Error al crear el programa'))
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
                        // Establecer fecha actual si no hay fecha seleccionada
                        const dateToUse = selectedDate || new Date().toISOString().split('T')[0]
                        // Establecer hora por defecto (primer slot disponible: 5:00 AM)
                        const defaultTime = '05:00'
                        setFormData(prev => ({
                          ...prev,
                          scheduled_date: dateToUse,
                          scheduled_time: defaultTime
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
                                  onClick={() => loadProgramForEdit(program.program_id)}
                                >
                                  <VStack align="start" spacing={1} h="100%">
                                    <HStack spacing={1} w="100%" justify="space-between">
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
                                      <HStack spacing={1}>
                                        <IconButton
                                          aria-label="Editar programa"
                                          icon={<FiEdit2 />}
                                          size="xs"
                                          colorScheme="blue"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            loadProgramForEdit(program.program_id)
                                          }}
                                        />
                                        <IconButton
                                          aria-label="Eliminar programa"
                                          icon={<FiTrash2 />}
                                          size="xs"
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={(e) => handleDeleteClick(program, e)}
                                        />
                                      </HStack>
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

      {/* Modal para crear/editar programa */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl" scrollBehavior="inside" isCentered>
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader bg="red.500" color="white" position="sticky" top={0} zIndex={1}>
            <HStack spacing={2}>
              <Icon as={editingProgramId ? FiEdit2 : FiPlus} />
              <Text>{editingProgramId ? 'Editar Programa' : 'Crear Nuevo Programa'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSubmit}>
            <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
              <VStack spacing={4} align="stretch" pt={4}>
                {/* Información del horario seleccionado */}
                {(selectedTimeSlot || formData.scheduled_date) && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Horario Programado</AlertTitle>
                      <AlertDescription fontSize="sm">
                        {formData.scheduled_date 
                          ? new Date(formData.scheduled_date).toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : 'Fecha no seleccionada'
                        } 
                        {formData.scheduled_time && ` a las ${formData.scheduled_time}`}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* Campos de fecha y hora si no se seleccionó desde el calendario */}
                {!selectedTimeSlot && (
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>
                        <HStack spacing={2}>
                          <Icon as={FiCalendar} />
                          <Text>Fecha Programada</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="scheduled_date"
                        value={formData.scheduled_date}
                        onChange={handleInputChange}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        focusBorderColor="red.500"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>
                        <HStack spacing={2}>
                          <Icon as={FiClock} />
                          <Text>Hora Programada</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleInputChange}
                        type="time"
                        focusBorderColor="red.500"
                      />
                      <FormHelperText fontSize="xs">
                        Horario permitido: 5:00 AM - 8:00 PM
                      </FormHelperText>
                    </FormControl>
                  </Grid>
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

                {/* Imagen del Programa */}
                <FormControl>
                  <FormLabel>Imagen del Programa</FormLabel>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageChange}
                    p={1}
                    focusBorderColor="red.500"
                  />
                  <FormHelperText>
                    Selecciona una imagen para el programa (JPG, PNG, WEBP)
                  </FormHelperText>
                  {formData.program_image && (
                    <Box mt={2}>
                      <HStack spacing={2}>
                        <Badge colorScheme="green" fontSize="xs">
                          {formData.program_image.isExisting ? '✓ Imagen actual' : '✓ Imagen seleccionada'}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {formData.program_image.name}
                        </Text>
                      </HStack>
                      {formData.program_image instanceof File && (
                        <Box mt={2}>
                          <Image
                            src={URL.createObjectURL(formData.program_image)}
                            alt="Vista previa"
                            maxH="100px"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        </Box>
                      )}
                      {formData.program_image.isExisting && !(formData.program_image instanceof File) && (
                        <Box mt={2}>
                          <Text fontSize="xs" color="gray.500" fontStyle="italic">
                            La imagen actual se mantendrá. Selecciona una nueva imagen para reemplazarla.
                          </Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </FormControl>

                {/* Usuarios - Locutores */}
                <FormControl isRequired>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FiUsers} />
                      <Text>Locutores del Programa</Text>
                    </HStack>
                  </FormLabel>
                  <Box
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={4}
                    maxH="250px"
                    overflowY="auto"
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
                  >
                    {loadingUsers ? (
                      <Flex justify="center" py={4}>
                        <Spinner size="md" color="red.500" />
                      </Flex>
                    ) : users.length === 0 ? (
                      <Box textAlign="center" py={4}>
                        <Text color="orange.500" fontSize="sm">
                          No hay usuarios con rol de locutor disponibles
                        </Text>
                      </Box>
                    ) : (
                      <VStack spacing={3} align="stretch">
                        {users.map((user) => {
                          const isSelected = formData.program_users?.includes(user.user_id)
                          return (
                            <Box
                              key={user.user_id}
                              p={3}
                              borderRadius="md"
                              border="2px solid"
                              borderColor={isSelected ? "red.400" : "gray.300"}
                              bg={isSelected ? "red.50" : "white"}
                              cursor="pointer"
                              _hover={{
                                borderColor: isSelected ? "red.500" : "red.300",
                                bg: isSelected ? "red.100" : "gray.100",
                                transform: "translateY(-1px)",
                                boxShadow: "sm"
                              }}
                              transition="all 0.2s"
                              onClick={() => handleUserSelection(user.user_id)}
                              _dark={{
                                bg: isSelected ? "red.900" : "gray.800",
                                borderColor: isSelected ? "red.400" : "gray.600"
                              }}
                            >
                              <HStack spacing={3}>
                                <Checkbox
                                  isChecked={isSelected}
                                  onChange={() => handleUserSelection(user.user_id)}
                                  value={user.user_id}
                                  colorScheme="red"
                                  size="lg"
                                />
                                <Avatar
                                  size="md"
                                  name={`${user.user_name || user.name} ${user.user_lastname || user.lastname}`}
                                  bg="red.500"
                                />
                                <VStack align="start" spacing={0} flex={1}>
                                  <HStack spacing={2}>
                                    <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                      {user.user_name || user.name} {user.user_lastname || user.lastname}
                                    </Text>
                                    {isSelected && (
                                      <Badge colorScheme="red" fontSize="xs" borderRadius="full">
                                        Seleccionado
                                      </Badge>
                                    )}
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                    {user.user_email || user.email}
                                  </Text>
                                  <Badge colorScheme="blue" variant="subtle" fontSize="xs" mt={1}>
                                    🎙️ Locutor
                                  </Badge>
                                </VStack>
                              </HStack>
                            </Box>
                          )
                        })}
                      </VStack>
                    )}
                  </Box>
                  {formData.program_users.length > 0 && (
                    <HStack mt={2} spacing={2}>
                      <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="full">
                        ✓ {formData.program_users.length} locutor(es) seleccionado(s)
                      </Badge>
                    </HStack>
                  )}
                  <FormHelperText>
                    Selecciona al menos un locutor para el programa. Mínimo 1 usuario con rol "locutor"
                  </FormHelperText>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                colorScheme="red"
                leftIcon={<FiSave />}
                isLoading={submitting}
                loadingText={editingProgramId ? "Actualizando..." : "Creando..."}
              >
                {editingProgramId ? 'Actualizar Programa' : 'Crear Programa'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmación para eliminar programa */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.500">
              Eliminar Programa
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el programa{' '}
              <Text as="span" fontWeight="bold">
                "{programToDelete?.program_title}"
              </Text>
              ?
              <br />
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose} isDisabled={deleting}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteProgram}
                ml={3}
                isLoading={deleting}
                loadingText="Eliminando..."
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default Programs
