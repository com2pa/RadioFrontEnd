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
      
      // Formatear las fechas recibidas para evitar problemas de zona horaria
      const formattedPrograms = Array.isArray(programsData) 
        ? programsData.map(program => {
            if (program.scheduled_date) {
              // Si viene con Z (UTC), parsearlo y reconstruirlo en hora local
              let date;
              if (typeof program.scheduled_date === 'string' && program.scheduled_date.includes('Z')) {
                // Parsear como UTC y convertir a hora local
                date = new Date(program.scheduled_date);
              } else if (typeof program.scheduled_date === 'string' && program.scheduled_date.includes('T')) {
                // Ya viene sin Z, parsearlo como hora local
                const [datePart, timePart] = program.scheduled_date.split('T');
                const [year, month, day] = datePart.split('-').map(Number);
                const [hours, minutes, seconds = 0] = timePart.split(':').map(Number);
                date = new Date(year, month - 1, day, hours, minutes, seconds || 0);
              } else {
                date = new Date(program.scheduled_date);
              }
              
              // Reconstruir en formato YYYY-MM-DDTHH:mm:ss sin zona horaria
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              const seconds = String(date.getSeconds()).padStart(2, '0');
              program.scheduled_date = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            }
            return program;
          })
        : []
      
      // console.log('📥 Programas recibidos del backend:', formattedPrograms.map(p => ({
      //   id: p.program_id,
      //   title: p.program_title,
      //   scheduled_date: p.scheduled_date
      // })))
      
      setPrograms(formattedPrograms)
    } catch (error) {
      // console.error('Error fetching programs:', error)
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
      // console.error('Error fetching users:', error)
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
      // console.error('Error fetching podcasts:', error)
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
      if (!program.scheduled_date) return false
      // Convertir la fecha del programa a fecha local para comparar
      const programDateObj = new Date(program.scheduled_date)
      const programDate = `${programDateObj.getFullYear()}-${String(programDateObj.getMonth() + 1).padStart(2, '0')}-${String(programDateObj.getDate()).padStart(2, '0')}`
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
      if (!program.scheduled_date) return false
      // Convertir la fecha del programa a fecha local para comparar
      const programDateObj = new Date(program.scheduled_date)
      const programDate = `${programDateObj.getFullYear()}-${String(programDateObj.getMonth() + 1).padStart(2, '0')}-${String(programDateObj.getDate()).padStart(2, '0')}`
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
      if (!program.scheduled_date) return false
      // Convertir la fecha del programa a fecha local para comparar
      const programDateObj = new Date(program.scheduled_date)
      const programDate = `${programDateObj.getFullYear()}-${String(programDateObj.getMonth() + 1).padStart(2, '0')}-${String(programDateObj.getDate()).padStart(2, '0')}`
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
      // console.error('Error loading program:', error)
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
      // console.error('Error deleting program:', error)
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

      // Crear fecha combinando fecha y hora EXACTAMENTE como se ingresó en el modal
      // Formato: YYYY-MM-DDTHH:mm:ss (sin zona horaria)
      // El backend interpretará esto como hora local
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`
      
      // Validar que la fecha sea válida creando un objeto Date para verificación
      const [year, month, day] = formData.scheduled_date.split('-').map(Number)
      const [hours, minutes] = formData.scheduled_time.split(':').map(Number)
      const validationDate = new Date(year, month - 1, day, hours, minutes, 0)
      
      if (isNaN(validationDate.getTime())) {
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
      
      // Log para debugging - mostrar exactamente lo que se envía desde el modal
      // console.log('📋 ========== DATOS DEL MODAL QUE SE ENVIARÁN ==========')
      // console.log('📅 Fecha y hora:', {
      //   'formData.scheduled_date': formData.scheduled_date,
      //   'formData.scheduled_time': formData.scheduled_time,
      //   'Fecha y hora combinada': scheduledDateTime,
      //   'Fecha validación (local)': validationDate.toLocaleString('es-ES'),
      //   'Año': validationDate.getFullYear(),
      //   'Mes': validationDate.getMonth() + 1,
      //   'Día': validationDate.getDate(),
      //   'Hora': validationDate.getHours(),
      //   'Minuto': validationDate.getMinutes(),
      //   'Segundo': validationDate.getSeconds()
      // })
      // console.log('📝 Todos los datos del formulario:', {
      //   'program_title': formData.program_title,
      //   'program_description': formData.program_description,
      //   'program_type': formData.program_type,
      //   'scheduled_date': formData.scheduled_date,
      //   'scheduled_time': formData.scheduled_time,
      //   'scheduledDateTime (combinado)': scheduledDateTime,
      //   'duration_minutes': formData.duration_minutes,
      //   'program_users': formData.program_users,
      //   'program_image': formData.program_image,
      //   'tiktok_live_url': formData.tiktok_live_url,
      //   'instagram_live_url': formData.instagram_live_url,
      //   'podcast_id': formData.podcast_id,
      //   'selectedTimeSlot': selectedTimeSlot,
      //   'editingProgramId': editingProgramId
      // })
      // console.log('📋 ===================================================')
      
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
        
        // Log de JSON antes de enviar
        // console.log('📤 Enviando con JSON (sin imagen):')
        // console.log('  - scheduled_date:', scheduledDateTime)
        // console.log('  - programData completo:', JSON.stringify(programData, null, 2))

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
      
      // Log final antes de enviar
      // console.log('🚀 ========== ENVIANDO PETICIÓN AL BACKEND ==========')
      // console.log('📡 Detalles de la petición:', {
      //   'Método HTTP': method.toUpperCase(),
      //   'URL': url,
      //   'Es edición': isEditing,
      //   'Tipo de datos': hasImage ? 'FormData (con imagen)' : 'JSON (sin imagen)',
      //   'scheduled_date que se envía': scheduledDateTime,
      //   'Fecha original del modal': formData.scheduled_date,
      //   'Hora original del modal': formData.scheduled_time
      // })
      
      // if (hasImage) {
      //   console.log('📎 FormData - Valores que se envían:')
      //   if (requestData instanceof FormData) {
      //     for (let pair of requestData.entries()) {
      //       console.log(`  ${pair[0]}:`, pair[1])
      //     }
      //   }
      // } else {
      //   console.log('📦 JSON - Objeto completo que se envía:')
      //   console.log(JSON.stringify(requestData, null, 2))
      // }
      // console.log('🚀 ==================================================')
      
      const response = await axios[method](url, requestData, {
        headers: headers
      })
      
      // console.log('✅ Respuesta del servidor recibida:', {
      //   'success': response.data.success,
      //   'message': response.data.message,
      //   'program_id': response.data.data?.program_id,
      //   'scheduled_date guardado': response.data.data?.scheduled_date
      // })
      
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
        // Recargar programas para actualizar el calendario
        await fetchPrograms()
      } else {
        throw new Error(response.data.message || (isEditing ? 'Error al actualizar el programa' : 'Error al crear el programa'))
      }
    } catch (error) {
      // console.error('Error creating program:', error)
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
      <Box 
        minH="100vh" 
        bg={bgColor} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        px={4}
      >
        <Alert status="error" maxW="md" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize={{ base: "sm", md: "md" }}>Acceso Denegado</AlertTitle>
            <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
              No tienes permisos para crear programas. Se requiere rol de editor o superior.
              <br />
              <Text fontSize={{ base: "xs", md: "sm" }} mt={2}>
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
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header */}
          <Box>
            <VStack align="stretch" spacing={4}>
              {/* Título y botón volver */}
              <VStack align={{ base: "start", md: "start" }} spacing={2}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "start", sm: "center" }}
                  gap={{ base: 3, md: 4 }}
                  wrap="wrap"
                >
                  <Button
                    as={RouterLink}
                    to="/dashboard/admin"
                    leftIcon={<FiArrowLeft />}
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  >
                    <Text display={{ base: "none", sm: "block" }}>Volver</Text>
                    <Text display={{ base: "block", sm: "none" }}>←</Text>
                  </Button>
                  <Heading 
                    size={{ base: "md", md: "lg", lg: "xl" }} 
                    color="red.600"
                  >
                    Programación de Programas
                  </Heading>
                  <Badge 
                    colorScheme="green" 
                    variant="solid" 
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {roleInfo.name.toUpperCase()}
                  </Badge>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Visualiza y crea programas en la línea de tiempo
                </Text>
              </VStack>
              
              {/* Navegación */}
              <Flex
                direction={{ base: "row", md: "row" }}
                justify="flex-end"
                align="center"
                gap={2}
                wrap="wrap"
              >
                <IconButton 
                  aria-label="Abrir menú" 
                  icon={<FiMenu />} 
                  onClick={onOpen}
                  size={{ base: "sm", md: "md" }}
                />
                <IconButton 
                  as={RouterLink} 
                  to="/" 
                  aria-label="Inicio" 
                  icon={<FiHome />}
                  size={{ base: "sm", md: "md" }}
                />
                <Button 
                  leftIcon={<FiLogOut />} 
                  colorScheme="red" 
                  variant="outline" 
                  onClick={logout}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <Text display={{ base: "none", sm: "block" }}>Cerrar sesión</Text>
                  <Text display={{ base: "block", sm: "none" }}>Salir</Text>
                </Button>
              </Flex>
            </VStack>
          </Box>

          {/* Menú administrativo */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/programs"
          />

          {/* Header de la programación semanal */}
          <Card bg={cardBg} boxShadow="lg">
            <CardHeader bg="red.500" color="white" p={{ base: 4, md: 6 }}>
              <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "md", md: "lg" }}>
                    Programación Semanal de Radio
                  </Heading>
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    size={{ base: "sm", md: "md" }}
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
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    <Text display={{ base: "none", sm: "block" }}>+ Nuevo Programa</Text>
                    <Text display={{ base: "block", sm: "none" }}>+ Nuevo</Text>
                  </Button>
                </Flex>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                  gap={3}
                  flexWrap="wrap"
                >
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    fontWeight="semibold"
                  >
                    {weekDates[0].dayNumber} - {weekDates[6].dayNumber} de {weekDates[0].month} {new Date(selectedDate).getFullYear()}
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      size={{ base: "xs", md: "sm" }}
                      bg="white"
                      color="gray.700"
                      maxW={{ base: "full", sm: "200px" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="tiktok_live">🎵 TikTok Live</option>
                      <option value="instagram_live">📷 Instagram Live</option>
                      <option value="podcast">🎙️ Podcast</option>
                    </Select>
                    <Button
                      size={{ base: "xs", md: "sm" }}
                      variant="outline"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() - 7)
                        setSelectedDate(newDate.toISOString().split('T')[0])
                      }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      <Text display={{ base: "none", sm: "block" }}>← Semana Anterior</Text>
                      <Text display={{ base: "block", sm: "none" }}>←</Text>
                    </Button>
                    <Button
                      size={{ base: "xs", md: "sm" }}
                      variant="outline"
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() + 7)
                        setSelectedDate(newDate.toISOString().split('T')[0])
                      }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      <Text display={{ base: "none", sm: "block" }}>Semana Siguiente →</Text>
                      <Text display={{ base: "block", sm: "none" }}>→</Text>
                    </Button>
                  </HStack>
                </Flex>
              </VStack>
            </CardHeader>
            <CardBody p={0}>
              {loadingPrograms ? (
                <Flex justify="center" py={12}>
                  <VStack spacing={4}>
                    <Spinner size={{ base: "lg", md: "xl" }} color="red.500" />
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Cargando programas...
                    </Text>
                  </VStack>
                </Flex>
              ) : (
                <Box 
                  overflowX="auto"
                  overflowY="auto"
                  maxH={{ base: "70vh", md: "80vh" }}
                >
                  {/* Grid semanal */}
                  <Grid 
                    templateColumns={{ base: "80px repeat(7, 1fr)", md: "100px repeat(7, 1fr)", lg: "120px repeat(7, 1fr)" }} 
                    gap={0} 
                    minW={{ base: "800px", md: "1200px", lg: "1400px" }}
                  >
                    {/* Columna de horas */}
                    <Box 
                      bg="gray.50" 
                      borderRight="2px solid" 
                      borderColor="gray.200" 
                      position="sticky" 
                      left={0} 
                      zIndex={10}
                    >
                      <Box 
                        h={{ base: "50px", md: "60px" }} 
                        borderBottom="1px solid" 
                        borderColor="gray.200" 
                      />
                      {timeSlots.map((slot, idx) => (
                        <Box
                          key={idx}
                          h={{ base: "50px", md: "60px" }}
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          p={{ base: 1, md: 2 }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            fontWeight="bold" 
                            color="gray.600"
                          >
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
                            h={{ base: "50px", md: "60px" }}
                            bg="gray.100"
                            borderBottom="2px solid"
                            borderColor="gray.300"
                            p={{ base: 1, md: 2 }}
                            textAlign="center"
                            position="sticky"
                            top={0}
                            zIndex={5}
                          >
                            <Text 
                              fontWeight="bold" 
                              fontSize={{ base: "2xs", md: "xs", lg: "sm" }} 
                              color="gray.700"
                            >
                              {day.dayName}
                            </Text>
                            <Text 
                              fontSize={{ base: "2xs", md: "xs" }} 
                              color="gray.500"
                            >
                              {day.dayNumber} {day.month}
                            </Text>
                          </Box>

                          {/* Contenedor de programas */}
                          <Box 
                            position="relative" 
                            minH={{ base: `${timeSlots.length * 50}px`, md: `${timeSlots.length * 60}px` }}
                          >
                            {/* Renderizar programas */}
                            {dayPrograms.map((program, progIdx) => {
                              const programTime = new Date(program.scheduled_date)
                              const programHour = programTime.getHours()
                              const programMinute = programTime.getMinutes()
                              const programStartMinutes = programHour * 60 + programMinute
                              const startSlot = timeSlots.findIndex(slot => slot.totalMinutes === programStartMinutes)
                              const durationSlots = Math.ceil((program.duration_minutes || 60) / 30)
                              // Usar 50px para móvil, 60px para desktop (se ajustará con CSS)
                              const slotHeight = 60 // Altura base, se ajusta con media queries
                              const topPosition = startSlot * slotHeight
                              const height = durationSlots * slotHeight

                              return (
                                <Box
                                  key={progIdx}
                                  position="absolute"
                                  top={`${topPosition}px`}
                                  left="2px"
                                  right="2px"
                                  h={`${height}px`}
                                  bg="white"
                                  borderRadius="md"
                                  boxShadow="sm"
                                  border="2px solid"
                                  borderColor={`${getTypeColor(program.program_type)}.400`}
                                  p={{ base: 1, md: 2 }}
                                  cursor="pointer"
                                  _hover={{
                                    boxShadow: "md",
                                    transform: "translateY(-2px)"
                                  }}
                                  transition="all 0.2s"
                                  onClick={() => loadProgramForEdit(program.program_id)}
                                >
                                  <VStack align="start" spacing={0.5} h="100%">
                                    <HStack spacing={1} w="100%" justify="space-between">
                                      <HStack spacing={1}>
                                        <Text fontSize={{ base: "sm", md: "lg" }}>
                                          {getTypeIcon(program.program_type)}
                                        </Text>
                                        <Badge
                                          colorScheme={getTypeColor(program.program_type)}
                                          fontSize={{ base: "2xs", md: "xs" }}
                                          borderRadius="full"
                                        >
                                          {(program.duration_minutes || 60) / 60}h
                                        </Badge>
                                      </HStack>
                                      <HStack spacing={0.5}>
                                        <IconButton
                                          aria-label="Editar programa"
                                          icon={<FiEdit2 />}
                                          size={{ base: "2xs", md: "xs" }}
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
                                          size={{ base: "2xs", md: "xs" }}
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={(e) => handleDeleteClick(program, e)}
                                        />
                                      </HStack>
                                    </HStack>
                                    <Text
                                      fontSize={{ base: "2xs", md: "xs" }}
                                      fontWeight="bold"
                                      noOfLines={{ base: 1, md: 2 }}
                                      flex={1}
                                      wordBreak="break-word"
                                    >
                                      {program.program_title}
                                    </Text>
                                    <Text 
                                      fontSize={{ base: "2xs", md: "xs" }} 
                                      color="gray.500"
                                      display={{ base: "none", md: "block" }}
                                    >
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
                                    left="2px"
                                    right="2px"
                                    h={{ base: "50px", md: "60px" }}
                                    border="2px dashed"
                                    borderColor="green.300"
                                    borderRadius="md"
                                    bg="green.50"
                                    p={{ base: 1, md: 2 }}
                                    cursor="pointer"
                                    _hover={{
                                      bg: "green.100",
                                      borderColor: "green.400"
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => {
                                      setSelectedTimeSlot(slot)
                                      setEditingProgramId(null) // Asegurar que no esté en modo edición
                                      setFormData(prev => ({
                                        ...prev,
                                        scheduled_date: day.date,
                                        scheduled_time: slot.time,
                                        program_title: '',
                                        program_description: '',
                                        program_type: '',
                                        tiktok_live_url: '',
                                        instagram_live_url: '',
                                        podcast_id: '',
                                        duration_minutes: 60,
                                        program_users: [],
                                        program_image: null
                                      }))
                                      onModalOpen()
                                    }}
                                  >
                                    <VStack align="start" spacing={0} h="100%" justify="center">
                                      <Text 
                                        fontSize={{ base: "2xs", md: "xs" }} 
                                        fontWeight="semibold" 
                                        color="green.600"
                                      >
                                        Espacio Libre
                                      </Text>
                                      <Text 
                                        fontSize={{ base: "2xs", md: "xs" }} 
                                        color="green.500"
                                        display={{ base: "none", md: "block" }}
                                      >
                                        {slot.time} - {(() => {
                                          const nextSlot = timeSlots[slotIdx + 1]
                                          return nextSlot ? nextSlot.time : '8:00 PM'
                                        })()}
                                      </Text>
                                      <Text 
                                        fontSize={{ base: "2xs", md: "xs" }} 
                                        color="green.400"
                                        display={{ base: "none", md: "block" }}
                                      >
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
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        size={{ base: "full", md: "xl" }} 
        scrollBehavior="inside" 
        isCentered
      >
        <ModalOverlay />
        <ModalContent maxH={{ base: "100vh", md: "90vh" }} mx={{ base: 0, md: 4 }}>
          <ModalHeader 
            bg="red.500" 
            color="white" 
            position="sticky" 
            top={0} 
            zIndex={1}
            p={{ base: 4, md: 6 }}
          >
            <HStack spacing={2}>
              <Icon as={editingProgramId ? FiEdit2 : FiPlus} boxSize={{ base: 5, md: 6 }} />
              <Text fontSize={{ base: "md", md: "lg" }}>
                {editingProgramId ? 'Editar Programa' : 'Crear Nuevo Programa'}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" size={{ base: "sm", md: "md" }} />
          <form onSubmit={handleSubmit}>
            <ModalBody 
              overflowY="auto" 
              maxH={{ base: "calc(100vh - 120px)", md: "calc(90vh - 140px)" }}
              px={{ base: 4, md: 6 }}
              pb={{ base: 4, md: 6 }}
            >
              <VStack spacing={{ base: 3, md: 4 }} align="stretch" pt={4}>
                {/* Información del horario seleccionado */}
                {(selectedTimeSlot || formData.scheduled_date) && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize={{ base: "xs", md: "sm" }}>
                        Horario Programado
                      </AlertTitle>
                      <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
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
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        <HStack spacing={2}>
                          <Icon as={FiCalendar} boxSize={{ base: 4, md: 5 }} />
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
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        <HStack spacing={2}>
                          <Icon as={FiClock} boxSize={{ base: 4, md: 5 }} />
                          <Text>Hora Programada</Text>
                        </HStack>
                      </FormLabel>
                      <Input
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleInputChange}
                        type="time"
                        focusBorderColor="red.500"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                        Horario permitido: 5:00 AM - 8:00 PM
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}

                {/* Título */}
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Título del Programa
                  </FormLabel>
                  <Input
                    name="program_title"
                    value={formData.program_title}
                    onChange={handleInputChange}
                    placeholder="Ej: Programa Matutino"
                    focusBorderColor="red.500"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>

                {/* Descripción */}
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Descripción
                  </FormLabel>
                  <Textarea
                    name="program_description"
                    value={formData.program_description}
                    onChange={handleInputChange}
                    placeholder="Descripción opcional..."
                    rows={3}
                    focusBorderColor="red.500"
                    size={{ base: "sm", md: "md" }}
                  />
                </FormControl>

                {/* Tipo */}
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Tipo de Programa
                  </FormLabel>
                  <Select
                    name="program_type"
                    value={formData.program_type}
                    onChange={handleInputChange}
                    placeholder="Selecciona el tipo"
                    focusBorderColor="red.500"
                    size={{ base: "sm", md: "md" }}
                  >
                    <option value="tiktok_live">🎵 TikTok Live</option>
                    <option value="instagram_live">📷 Instagram Live</option>
                    <option value="podcast">🎙️ Podcast</option>
                  </Select>
                </FormControl>

                {/* URL de TikTok Live */}
                {formData.program_type === 'tiktok_live' && (
                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>
                      URL de TikTok Live
                    </FormLabel>
                    <Input
                      name="tiktok_live_url"
                      value={formData.tiktok_live_url}
                      onChange={handleInputChange}
                      placeholder="https://www.tiktok.com/@usuario/live"
                      type="url"
                      focusBorderColor="red.500"
                      size={{ base: "sm", md: "md" }}
                    />
                  </FormControl>
                )}

                {/* URL de Instagram Live */}
                {formData.program_type === 'instagram_live' && (
                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>
                      URL de Instagram Live
                    </FormLabel>
                    <Input
                      name="instagram_live_url"
                      value={formData.instagram_live_url}
                      onChange={handleInputChange}
                      placeholder="https://www.instagram.com/usuario/live"
                      type="url"
                      focusBorderColor="red.500"
                      size={{ base: "sm", md: "md" }}
                    />
                  </FormControl>
                )}

                {/* Podcast */}
                {formData.program_type === 'podcast' && (
                  <FormControl isRequired>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>
                      Podcast
                    </FormLabel>
                    <Select
                      name="podcast_id"
                      value={formData.podcast_id}
                      onChange={handleInputChange}
                      placeholder="Selecciona un podcast"
                      isDisabled={loadingPodcasts}
                      focusBorderColor="red.500"
                      size={{ base: "sm", md: "md" }}
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
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Duración (minutos)
                  </FormLabel>
                  <Input
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    type="number"
                    min={60}
                    max={120}
                    step={15}
                    focusBorderColor="red.500"
                    size={{ base: "sm", md: "md" }}
                  />
                  <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                    Entre 60 y 120 minutos
                  </FormHelperText>
                </FormControl>

                {/* Imagen del Programa */}
                <FormControl>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Imagen del Programa
                  </FormLabel>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageChange}
                    p={1}
                    focusBorderColor="red.500"
                    size={{ base: "sm", md: "md" }}
                  />
                  <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                    Selecciona una imagen para el programa (JPG, PNG, WEBP)
                  </FormHelperText>
                  {formData.program_image && (
                    <Box mt={2}>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge 
                          colorScheme="green" 
                          fontSize={{ base: "2xs", md: "xs" }}
                        >
                          {formData.program_image.isExisting ? '✓ Imagen actual' : '✓ Imagen seleccionada'}
                        </Badge>
                        <Text 
                          fontSize={{ base: "2xs", md: "xs" }} 
                          color="gray.500"
                        >
                          {formData.program_image.name}
                        </Text>
                      </HStack>
                      {formData.program_image instanceof File && (
                        <Box mt={2}>
                          <Image
                            src={URL.createObjectURL(formData.program_image)}
                            alt="Vista previa"
                            maxH={{ base: "80px", md: "100px" }}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        </Box>
                      )}
                      {formData.program_image.isExisting && !(formData.program_image instanceof File) && (
                        <Box mt={2}>
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            color="gray.500" 
                            fontStyle="italic"
                          >
                            La imagen actual se mantendrá. Selecciona una nueva imagen para reemplazarla.
                          </Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </FormControl>

                {/* Usuarios - Locutores */}
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    <HStack spacing={2}>
                      <Icon as={FiUsers} boxSize={{ base: 4, md: 5 }} />
                      <Text>Locutores del Programa</Text>
                    </HStack>
                  </FormLabel>
                  <Box
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={{ base: 3, md: 4 }}
                    maxH={{ base: "200px", md: "250px" }}
                    overflowY="auto"
                    bg="gray.50"
                    _dark={{ bg: "gray.700" }}
                  >
                    {loadingUsers ? (
                      <Flex justify="center" py={4}>
                        <VStack spacing={2}>
                          <Spinner size={{ base: "sm", md: "md" }} color="red.500" />
                          <Text 
                            fontSize={{ base: "xs", md: "sm" }}
                            color={textColor}
                          >
                            Cargando locutores...
                          </Text>
                        </VStack>
                      </Flex>
                    ) : users.length === 0 ? (
                      <Box textAlign="center" py={4}>
                        <Text 
                          color="orange.500" 
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          No hay usuarios con rol de locutor disponibles
                        </Text>
                      </Box>
                    ) : (
                      <VStack spacing={{ base: 2, md: 3 }} align="stretch">
                        {users.map((user) => {
                          const isSelected = formData.program_users?.includes(user.user_id)
                          return (
                            <Box
                              key={user.user_id}
                              p={{ base: 2, md: 3 }}
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
                              <HStack spacing={{ base: 2, md: 3 }}>
                                <Checkbox
                                  isChecked={isSelected}
                                  onChange={() => handleUserSelection(user.user_id)}
                                  value={user.user_id}
                                  colorScheme="red"
                                  size={{ base: "md", md: "lg" }}
                                />
                                <Avatar
                                  size={{ base: "sm", md: "md" }}
                                  name={`${user.user_name || user.name} ${user.user_lastname || user.lastname}`}
                                  bg="red.500"
                                />
                                <VStack align="start" spacing={0} flex={1}>
                                  <HStack spacing={2} flexWrap="wrap">
                                    <Text 
                                      fontSize={{ base: "xs", md: "sm" }} 
                                      fontWeight="bold" 
                                      noOfLines={1}
                                    >
                                      {user.user_name || user.name} {user.user_lastname || user.lastname}
                                    </Text>
                                    {isSelected && (
                                      <Badge 
                                        colorScheme="red" 
                                        fontSize={{ base: "2xs", md: "xs" }} 
                                        borderRadius="full"
                                      >
                                        Seleccionado
                                      </Badge>
                                    )}
                                  </HStack>
                                  <Text 
                                    fontSize={{ base: "2xs", md: "xs" }} 
                                    color="gray.500" 
                                    noOfLines={1}
                                  >
                                    {user.user_email || user.email}
                                  </Text>
                                  <Badge 
                                    colorScheme="blue" 
                                    variant="subtle" 
                                    fontSize={{ base: "2xs", md: "xs" }} 
                                    mt={1}
                                  >
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
                    <HStack mt={2} spacing={2} flexWrap="wrap">
                      <Badge 
                        colorScheme="green" 
                        fontSize={{ base: "xs", md: "sm" }} 
                        px={2} 
                        py={1} 
                        borderRadius="full"
                      >
                        ✓ {formData.program_users.length} locutor(es) seleccionado(s)
                      </Badge>
                    </HStack>
                  )}
                  <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                    Selecciona al menos un locutor para el programa. Mínimo 1 usuario con rol "locutor"
                  </FormHelperText>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                w="full"
                gap={3}
              >
                <Button 
                  variant="ghost" 
                  onClick={handleCloseModal}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  flex={1}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="red"
                  leftIcon={<FiSave />}
                  isLoading={submitting}
                  loadingText={editingProgramId ? "Actualizando..." : "Creando..."}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  flex={1}
                >
                  {editingProgramId ? 'Actualizar Programa' : 'Crear Programa'}
                </Button>
              </Flex>
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
          <AlertDialogContent mx={{ base: 4, md: 0 }} maxW={{ base: "full", md: "md" }}>
            <AlertDialogHeader 
              fontSize={{ base: "md", md: "lg" }} 
              fontWeight="bold" 
              color="red.500"
              pb={{ base: 3, md: 4 }}
            >
              Eliminar Programa
            </AlertDialogHeader>

            <AlertDialogBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
              <Text fontSize={{ base: "sm", md: "md" }}>
                ¿Estás seguro de que deseas eliminar el programa{' '}
                <Text as="span" fontWeight="bold">
                  "{programToDelete?.program_title}"
                </Text>
                ?
              </Text>
              <br />
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                Esta acción no se puede deshacer.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                w="full"
                gap={3}
              >
                <Button 
                  ref={cancelRef} 
                  onClick={onDeleteDialogClose} 
                  isDisabled={deleting}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  flex={1}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteProgram}
                  isLoading={deleting}
                  loadingText="Eliminando..."
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  flex={1}
                >
                  Eliminar
                </Button>
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default Programs
