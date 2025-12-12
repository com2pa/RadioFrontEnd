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
  Switch,
  FormHelperText,
  Image,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { 
  FiSave, 
  FiUpload, 
  FiImage, 
  FiMenu, 
  FiHome, 
  FiLogOut, 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2,
  FiEye,
  FiExternalLink,
  FiDollarSign
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import { getUserRoleInfo, canAdmin } from '../../utils/roleUtils'
import axios from 'axios'

const AdvertisingManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const roleInfo = getUserRoleInfo(auth)

  // Estados
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    adId: null,
    adTitle: '',
    isDeleting: false
  })

  const [formData, setFormData] = useState({
    company_name: '',
    rif: '',
    company_address: '',
    phone: '',
    email: '',
    start_date: '',
    end_date: '',
    time: '',
    advertising_days: '',
    publication_days: [], // Array de días de la semana: ['lunes', 'martes', etc.]
    status: true,
    advertising_image: null
  })

  // Días de la semana válidos
  const weekDays = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miércoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sábado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ]

  // Verificar permisos de administrador
  if (!auth || !canAdmin(auth)) {
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
              No tienes permisos para acceder a esta página.
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  // Obtener todas las publicidades
  const fetchAdvertisements = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get('/api/advertising/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || [])
      setAdvertisements(data)
    } catch (error) {
      console.error('Error obteniendo publicidades:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudieron cargar las publicidades',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setAdvertisements([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Cargar datos al montar
  useEffect(() => {
    fetchAdvertisements()
  }, [fetchAdvertisements])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Manejar cambios en los días de publicación
  const handlePublicationDaysChange = (selectedDays) => {
    setFormData(prev => ({
      ...prev,
      publication_days: selectedDays || []
    }))
  }

  // Crear nueva publicidad
  const createAdvertisement = async () => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      // Si hay imagen, usar FormData, si no, usar JSON
      let dataToSend
      let headers = {
        'Authorization': `Bearer ${token}`
      }

      if (formData.advertising_image && formData.advertising_image instanceof File) {
        // Usar FormData para enviar la imagen
        const formDataToSend = new FormData()
        formDataToSend.append('company_name', formData.company_name.trim())
        formDataToSend.append('rif', formData.rif.trim())
        formDataToSend.append('company_address', formData.company_address.trim())
        formDataToSend.append('phone', formData.phone.trim())
        formDataToSend.append('email', formData.email.trim())
        formDataToSend.append('start_date', formData.start_date ? formData.start_date.split('T')[0] : '')
        formDataToSend.append('end_date', formData.end_date ? formData.end_date.split('T')[0] : '')
        if (formData.time) formDataToSend.append('time', formData.time)
        formDataToSend.append('advertising_days', parseInt(formData.advertising_days) || 0)
        formDataToSend.append('publication_days', JSON.stringify(Array.isArray(formData.publication_days) ? formData.publication_days : []))
        formDataToSend.append('status', formData.status)
        formDataToSend.append('advertising_image', formData.advertising_image)
        
        dataToSend = formDataToSend
        // No establecer Content-Type para FormData, el navegador lo hace automáticamente
      } else {
        // Usar JSON si no hay imagen
        dataToSend = {
          company_name: formData.company_name.trim(),
          rif: formData.rif.trim(),
          company_address: formData.company_address.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          start_date: formData.start_date ? formData.start_date.split('T')[0] : '',
          end_date: formData.end_date ? formData.end_date.split('T')[0] : '',
          time: formData.time || null,
          advertising_days: parseInt(formData.advertising_days) || 0,
          publication_days: Array.isArray(formData.publication_days) ? formData.publication_days : [],
          status: formData.status
        }
        headers['Content-Type'] = 'application/json'
      }

      const response = await axios.post('/api/advertising/create', dataToSend, {
        headers
      })

      if (response.data.success) {
        toast({
          title: 'Publicidad creada',
          description: response.data.message || 'La publicidad ha sido creada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        resetForm()
        fetchAdvertisements()
      } else {
        throw new Error(response.data.message || 'Error al crear la publicidad')
      }
    } catch (error) {
      console.error('Error creando publicidad:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo crear la publicidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Actualizar publicidad
  const updateAdvertisement = async () => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      // Si hay una nueva imagen, usar FormData, si no, usar JSON
      let dataToSend
      let headers = {
        'Authorization': `Bearer ${token}`
      }

      if (formData.advertising_image && formData.advertising_image instanceof File) {
        // Usar FormData para enviar la nueva imagen
        const formDataToSend = new FormData()
        if (formData.company_name) formDataToSend.append('company_name', formData.company_name.trim())
        if (formData.rif) formDataToSend.append('rif', formData.rif.trim())
        if (formData.company_address) formDataToSend.append('company_address', formData.company_address.trim())
        if (formData.phone) formDataToSend.append('phone', formData.phone.trim())
        if (formData.email) formDataToSend.append('email', formData.email.trim())
        if (formData.start_date) formDataToSend.append('start_date', formData.start_date.split('T')[0])
        if (formData.end_date) formDataToSend.append('end_date', formData.end_date.split('T')[0])
        if (formData.time !== undefined) formDataToSend.append('time', formData.time || '')
        if (formData.advertising_days) formDataToSend.append('advertising_days', parseInt(formData.advertising_days))
        if (formData.publication_days !== undefined) {
          formDataToSend.append('publication_days', JSON.stringify(Array.isArray(formData.publication_days) ? formData.publication_days : []))
        }
        if (formData.status !== undefined) formDataToSend.append('status', formData.status)
        formDataToSend.append('advertising_image', formData.advertising_image)
        
        dataToSend = formDataToSend
        // No establecer Content-Type para FormData
      } else {
        // Usar JSON si no hay nueva imagen
        dataToSend = {}
        if (formData.company_name) dataToSend.company_name = formData.company_name.trim()
        if (formData.rif) dataToSend.rif = formData.rif.trim()
        if (formData.company_address) dataToSend.company_address = formData.company_address.trim()
        if (formData.phone) dataToSend.phone = formData.phone.trim()
        if (formData.email) dataToSend.email = formData.email.trim()
        if (formData.start_date) dataToSend.start_date = formData.start_date.split('T')[0]
        if (formData.end_date) dataToSend.end_date = formData.end_date.split('T')[0]
        if (formData.time !== undefined) dataToSend.time = formData.time || null
        if (formData.advertising_days) dataToSend.advertising_days = parseInt(formData.advertising_days)
        if (formData.publication_days !== undefined) {
          dataToSend.publication_days = Array.isArray(formData.publication_days) 
            ? formData.publication_days 
            : []
        }
        if (formData.status !== undefined) dataToSend.status = formData.status
        
        headers['Content-Type'] = 'application/json'
      }

      const response = await axios.put(`/api/advertising/update/${editingId}`, dataToSend, {
        headers
      })

      if (response.data.success) {
        toast({
          title: 'Publicidad actualizada',
          description: response.data.message || 'La publicidad ha sido actualizada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        resetForm()
        fetchAdvertisements()
      } else {
        throw new Error(response.data.message || 'Error al actualizar la publicidad')
      }
    } catch (error) {
      console.error('Error actualizando publicidad:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo actualizar la publicidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Actualizar estado de publicidad
  const updateAdvertisementStatus = async (adId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      const response = await axios.patch(`/api/advertising/update/${adId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        toast({
          title: 'Estado actualizado',
          description: response.data.message || `Publicidad ${newStatus ? 'activada' : 'desactivada'} exitosamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        fetchAdvertisements()
      } else {
        throw new Error(response.data.message || 'Error al actualizar el estado')
      }
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo actualizar el estado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Eliminar publicidad
  const deleteAdvertisement = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }))
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.delete(`/api/advertising/delete/${deleteModal.adId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        toast({
          title: 'Publicidad eliminada',
          description: response.data.message || 'La publicidad ha sido eliminada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setDeleteModal({ isOpen: false, adId: null, adTitle: '', isDeleting: false })
        fetchAdvertisements()
      } else {
        throw new Error(response.data.message || 'Error al eliminar la publicidad')
      }
    } catch (error) {
      console.error('Error eliminando publicidad:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudo eliminar la publicidad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      company_name: '',
      rif: '',
      company_address: '',
      phone: '',
      email: '',
      start_date: '',
      end_date: '',
      time: '',
      advertising_days: '',
      publication_days: [],
      status: true,
      advertising_image: null
    })
    setEditingId(null)
  }

  // Cargar datos para edición
  const handleEdit = (ad) => {
    // Formatear fechas para input datetime-local (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // Procesar publication_days (puede venir como JSON string o array)
    let publicationDays = []
    if (ad.publication_days) {
      if (typeof ad.publication_days === 'string') {
        try {
          publicationDays = JSON.parse(ad.publication_days)
        } catch (e) {
          // Si no es JSON válido, intentar como array
          publicationDays = Array.isArray(ad.publication_days) ? ad.publication_days : []
        }
      } else if (Array.isArray(ad.publication_days)) {
        publicationDays = ad.publication_days
      }
    }

    setFormData({
      company_name: ad.company_name || '',
      rif: ad.rif || '',
      company_address: ad.company_address || '',
      phone: ad.phone || '',
      email: ad.email || '',
      start_date: formatDateForInput(ad.start_date),
      end_date: formatDateForInput(ad.end_date),
      time: ad.time || '',
      advertising_days: ad.advertising_days?.toString() || '',
      publication_days: publicationDays,
      status: ad.status !== undefined ? ad.status : true,
      advertising_image: null // No cargar imagen existente
    })
    setEditingId(ad.advertising_id || ad.id)
  }

  // Abrir modal de confirmación de eliminación
  const openDeleteModal = (adId, adTitle) => {
    setDeleteModal({
      isOpen: true,
      adId,
      adTitle,
      isDeleting: false
    })
  }

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      adId: null,
      adTitle: '',
      isDeleting: false
    })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.company_name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la empresa es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.rif.trim()) {
      toast({
        title: 'Error',
        description: 'El RIF es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.company_address.trim()) {
      toast({
        title: 'Error',
        description: 'La dirección es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.phone.trim()) {
      toast({
        title: 'Error',
        description: 'El teléfono es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Error',
        description: 'El email es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.start_date) {
      toast({
        title: 'Error',
        description: 'La fecha de inicio es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.end_date) {
      toast({
        title: 'Error',
        description: 'La fecha de fin es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.advertising_days || parseInt(formData.advertising_days) <= 0) {
      toast({
        title: 'Error',
        description: 'Los días de publicidad son requeridos y deben ser mayor a 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (editingId) {
      await updateAdvertisement()
    } else {
      await createAdvertisement()
    }
  }


  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header */}
          <Box>
            <VStack align="stretch" spacing={4}>
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
                    color="blue.600"
                  >
                    Gestión de Publicidad
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Crear y administrar publicidad para la página
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
            currentPage="/dashboard/admin/advertising"
          />

          {/* Contenido principal */}
          <Box 
            display={{ base: 'block', lg: 'grid' }} 
            gridTemplateColumns="1fr 1fr" 
            gap={{ base: 4, md: 6, lg: 8 }}
          >
            {/* Formulario */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <Heading size={{ base: "sm", md: "md" }}>
                  {editingId ? 'Editar Publicidad' : 'Crear Nueva Publicidad'}
                </Heading>
              </CardHeader>
              <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    {/* Nombre de la empresa */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Nombre de la Empresa
                      </FormLabel>
                      <Input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Ej: Empresa XYZ S.A."
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* RIF */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        RIF
                      </FormLabel>
                      <Input
                        name="rif"
                        value={formData.rif}
                        onChange={handleInputChange}
                        placeholder="Ej: J-12345678-9"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* Dirección */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Dirección de la Empresa
                      </FormLabel>
                      <Textarea
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleInputChange}
                        placeholder="Dirección completa de la empresa"
                        size={{ base: "sm", md: "md" }}
                        rows={3}
                      />
                    </FormControl>

                    {/* Teléfono */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Teléfono
                      </FormLabel>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Ej: +58 212 1234567"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* Email */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Email
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contacto@empresa.com"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* Fecha de inicio */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Fecha de Inicio
                      </FormLabel>
                      <Input
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* Fecha de fin */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Fecha de Fin
                      </FormLabel>
                      <Input
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    {/* Hora */}
                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Hora (Opcional)
                      </FormLabel>
                      <Input
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="Ej: 08:00 - 12:00"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                        Horario de la publicidad (opcional)
                      </FormHelperText>
                    </FormControl>

                    {/* Días de publicidad */}
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Días de Publicidad
                      </FormLabel>
                      <Input
                        name="advertising_days"
                        type="number"
                        min="1"
                        value={formData.advertising_days}
                        onChange={handleInputChange}
                        placeholder="Ej: 30"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                        Número de días que durará la publicidad
                      </FormHelperText>
                    </FormControl>

                    {/* Días de la semana para publicación */}
                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Días de la Semana (Opcional)
                      </FormLabel>
                      <CheckboxGroup
                        value={formData.publication_days}
                        onChange={handlePublicationDaysChange}
                        colorScheme="blue"
                      >
                        <Wrap spacing={{ base: 2, md: 3 }}>
                          {weekDays.map((day) => (
                            <WrapItem key={day.value}>
                              <Checkbox value={day.value} size={{ base: "sm", md: "md" }}>
                                <Text fontSize={{ base: "xs", md: "sm" }}>{day.label}</Text>
                              </Checkbox>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </CheckboxGroup>
                      <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                        Selecciona los días de la semana en que se publicará la publicidad
                      </FormHelperText>
                    </FormControl>

                    {/* Imagen */}
                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Imagen de Publicidad
                      </FormLabel>
                      <Input
                        name="advertising_image"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormHelperText fontSize={{ base: "xs", md: "sm" }}>
                        {formData.advertising_image ? formData.advertising_image.name : 'Selecciona una imagen para la publicidad (opcional)'}
                      </FormHelperText>
                    </FormControl>

                    {/* Estado */}
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="status" mb="0" fontSize={{ base: "sm", md: "md" }}>
                        Activo
                      </FormLabel>
                      <Switch
                        id="status"
                        name="status"
                        isChecked={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                        colorScheme="green"
                      />
                    </FormControl>

                    {/* Botones */}
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      gap={3}
                    >
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="blue"
                        flex={1}
                        isLoading={submitting}
                        loadingText={editingId ? 'Actualizando...' : 'Creando...'}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {editingId ? 'Actualizar' : 'Crear'} Publicidad
                      </Button>
                      {editingId && (
                        <Button
                          onClick={resetForm}
                          variant="outline"
                          flex={1}
                          isDisabled={submitting}
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Lista de publicidades */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>
                    Publicidades Existentes
                  </Heading>
                  <Badge 
                    colorScheme="blue" 
                    variant="subtle"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {advertisements.length} publicidades
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <VStack spacing={4}>
                      <Spinner 
                        size={{ base: "md", md: "lg" }} 
                        color="blue.500" 
                      />
                      <Text 
                        color={textColor}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Cargando publicidades...
                      </Text>
                    </VStack>
                  </Box>
                ) : advertisements.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      No hay publicidades creadas
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table size={{ base: "xs", md: "sm" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Imagen</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Empresa</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                            RIF
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                            Email
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {advertisements.map((ad) => {
                          // Construir URL de la imagen
                          const getImageUrl = (imageName) => {
                            if (!imageName) return null
                            if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
                              return imageName
                            }
                            return `/api/advertising/images/${encodeURIComponent(imageName)}`
                          }
                          const imageUrl = getImageUrl(ad.advertising_image)

                          return (
                            <Tr key={ad.advertising_id || ad.id}>
                              <Td>
                                {imageUrl ? (
                                  <Box
                                    w={{ base: "50px", md: "80px", lg: "100px" }}
                                    h={{ base: "50px", md: "80px", lg: "100px" }}
                                    borderRadius="md"
                                    overflow="hidden"
                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt={ad.company_name || 'Publicidad'}
                                      w="100%"
                                      h="100%"
                                      objectFit="cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                      }}
                                    />
                                    <Flex
                                      display="none"
                                      align="center"
                                      justify="center"
                                      w="100%"
                                      h="100%"
                                      bg={useColorModeValue('gray.100', 'gray.700')}
                                    >
                                      <Text fontSize="2xs" color={textColor} textAlign="center" px={1}>
                                        Sin imagen
                                      </Text>
                                    </Flex>
                                  </Box>
                                ) : (
                                  <Box
                                    w={{ base: "50px", md: "80px", lg: "100px" }}
                                    h={{ base: "50px", md: "80px", lg: "100px" }}
                                    borderRadius="md"
                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    display="flex"
                                    align="center"
                                    justify="center"
                                  >
                                    <Text fontSize="2xs" color={textColor} textAlign="center" px={1}>
                                      Sin imagen
                                    </Text>
                                  </Box>
                                )}
                              </Td>
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text 
                                    fontWeight="medium" 
                                    fontSize={{ base: "xs", md: "sm" }}
                                    wordBreak="break-word"
                                  >
                                    {ad.company_name || 'N/A'}
                                  </Text>
                                  <Text 
                                    fontSize={{ base: "2xs", md: "xs" }} 
                                    color={textColor}
                                    display={{ base: "block", md: "none" }}
                                  >
                                    RIF: {ad.rif || 'N/A'}
                                  </Text>
                                  <Text 
                                    fontSize={{ base: "2xs", md: "xs" }} 
                                    color={textColor}
                                    display={{ base: "block", lg: "none" }}
                                  >
                                    {ad.email || 'N/A'}
                                  </Text>
                                </VStack>
                              </Td>
                            <Td 
                              fontSize={{ base: "xs", md: "sm" }}
                              display={{ base: "none", md: "table-cell" }}
                            >
                              {ad.rif || 'N/A'}
                            </Td>
                            <Td 
                              fontSize={{ base: "xs", md: "sm" }}
                              display={{ base: "none", lg: "table-cell" }}
                            >
                              {ad.email || 'N/A'}
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <Badge 
                                  colorScheme={ad.status ? 'green' : 'gray'}
                                  variant="subtle"
                                  fontSize={{ base: "2xs", md: "xs" }}
                                >
                                  {ad.status ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <Switch
                                  size="sm"
                                  isChecked={ad.status}
                                  onChange={(e) => updateAdvertisementStatus(ad.advertising_id || ad.id, e.target.checked)}
                                  colorScheme="green"
                                />
                              </HStack>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  aria-label="Editar publicidad"
                                  icon={<FiEdit />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  onClick={() => handleEdit(ad)}
                                  isDisabled={submitting}
                                />
                                <IconButton
                                  aria-label="Eliminar publicidad"
                                  icon={<FiTrash2 />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => openDeleteModal(ad.advertising_id || ad.id, ad.company_name || 'N/A')}
                                  isDisabled={submitting}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                          )
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={{ base: "sm", md: "md" }}>
            Confirmar Eliminación
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={{ base: "sm", md: "md" }}>
              ¿Estás seguro de que deseas eliminar la publicidad "{deleteModal.adTitle}"?
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color={textColor} mt={2}>
              Esta acción no se puede deshacer.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={closeDeleteModal}
              size={{ base: "sm", md: "md" }}
              isDisabled={deleteModal.isDeleting}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteAdvertisement}
              isLoading={deleteModal.isDeleting}
              loadingText="Eliminando..."
              size={{ base: "sm", md: "md" }}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdvertisingManagement

