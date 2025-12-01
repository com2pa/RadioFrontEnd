import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Button,
  useToast,
  Heading,
  Spinner,
  Badge,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Avatar,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip
} from '@chakra-ui/react'
import { 
  FiMail, 
  FiEye, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiMenu,
  FiHome,
  FiLogOut
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AdminMenu from '../../components/layout/AdminMenu'
import { getUserRoleInfo } from '../../utils/roleUtils'
import webSocketService from '../../services/websocketService'

const ContactNotifications = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const roleInfo = getUserRoleInfo(auth)

  // Estados
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [hasTriedToLoad, setHasTriedToLoad] = useState(false)
  const hasInitialized = useRef(false)

  // Modal para ver detalles del mensaje
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Modal para el menú administrativo
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure()

  // Conectar WebSocket usando Socket.IO
  const connectWebSocket = useCallback(async () => {
    try {
      setConnectionStatus('disconnected')
      
      await webSocketService.connect()
      webSocketService.joinAdmin()
      
      // Escuchar notificaciones de contacto
      webSocketService.on('new-contact', (data) => {
        // console.log('📨 Nueva notificación de contacto:', data)
        
        // Mapear los datos del backend a la estructura esperada por el frontend
        const messageData = {
          id: data.contact?.contact_id || data.contact_id || Date.now(),
          contact_name: data.contact?.contact_name || data.contact_name,
          contact_lastname: data.contact?.contact_lastname || data.contact_lastname,
          contact_email: data.contact?.contact_email || data.contact_email,
          contact_phone: data.contact?.contact_phone || data.contact_phone,
          contact_message: data.contact?.contact_message || data.contact_message,
          timestamp: data.contact?.contact_created_at || data.contact_created_at || new Date().toISOString(),
          // Los nuevos mensajes siempre llegan como 'unread'
          status: 'unread'
        }
        
        // console.log('📝 Mensaje mapeado:', messageData)
        
        setMessages(prev => [messageData, ...prev])
        
        toast({
          title: 'Nuevo mensaje de contacto',
          description: `${messageData.contact_name} ${messageData.contact_lastname} ha enviado un mensaje`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
      })

      // Escuchar notificaciones generales
      webSocketService.on('notification', (notification) => {
        // console.log('📢 Notificación general recibida:', notification)
        
        // Si es una notificación de contacto, procesarla
        if (notification.type === 'new_contact' || notification.type === 'contact') {
          // Extraer datos del contacto desde la notificación
          const contactData = notification.data?.contact || notification.contact || notification
          
          const messageData = {
            id: contactData.contact_id || Date.now(),
            contact_name: contactData.contact_name,
            contact_lastname: contactData.contact_lastname,
            contact_email: contactData.contact_email,
            contact_phone: contactData.contact_phone,
            contact_message: contactData.contact_message,
            timestamp: contactData.contact_created_at || new Date().toISOString(),
            // Los nuevos mensajes siempre llegan como 'unread'
            status: 'unread'
          }
          
          // console.log('📝 Mensaje desde notificación general:', messageData)
          
          setMessages(prev => [messageData, ...prev])
          
          toast({
            title: 'Nuevo mensaje de contacto',
            description: `${messageData.contact_name} ${messageData.contact_lastname} ha enviado un mensaje`,
            status: 'info',
            duration: 5000,
            isClosable: true,
          })
        }
      })

      // Escuchar cambios de estado de conexión
      webSocketService.on('connection-status', (status) => {
        setConnectionStatus(status.connected ? 'connected' : 'disconnected')
        if (status.connected) {
          toast({
            title: 'Conectado',
            description: 'Recibiendo notificaciones en tiempo real',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        }
      })

      setConnectionStatus('connected')
    } catch (error) {
      // console.error('❌ Error al conectar WebSocket:', error)
      setConnectionStatus('error')
      
      // Solo mostrar toast de error si no hay conexión previa
      if (connectionStatus === 'disconnected') {
        toast({
          title: 'Servidor no disponible',
          description: 'El servidor de notificaciones no está disponible. Las notificaciones en tiempo real no funcionarán.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }, [toast, connectionStatus])

  // Cargar mensajes iniciales
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setHasTriedToLoad(true)
      
      const response = await fetch('/api/contacts', {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar mensajes')
      }

      const data = await response.json()
      // console.log('📨 Datos recibidos del endpoint /api/contacts:', data)
      
      // El backend envía los datos en data.data (array)
      const contactsArray = data.data || data.messages || data.contacts || []
      // console.log('📋 Array de contactos encontrado:', contactsArray)
      
      // Mapear los datos del backend a la estructura esperada por el frontend
      const mappedMessages = contactsArray.map(contact => {
        // console.log('📋 Mapeando contacto:', {
        //   id: contact.contact_id,
        //   name: contact.contact_name,
        //   // Verificar todos los posibles campos de estado
        //   contact_status: contact.contact_status,
        //   is_read: contact.is_read,
        //   read: contact.read,
        //   status: contact.status
        // })
        
        return {
          id: contact.contact_id || contact.id,
          contact_name: contact.contact_name,
          contact_lastname: contact.contact_lastname,
          contact_email: contact.contact_email,
          contact_phone: contact.contact_phone,
          contact_message: contact.contact_message,
          timestamp: contact.contact_created_at || contact.created_at || contact.timestamp,
          // Mapear correctamente el estado de leído/no leído
          // El campo que tiene true/false en la BD indica si está leído
          status: (contact.contact_status === true || contact.is_read === true || contact.read === true) ? 'read' : 'unread'
        }
      })
      
      // console.log('📝 Mensajes mapeados:', mappedMessages)
      // console.log('📊 Total de mensajes a mostrar:', mappedMessages.length)
      setMessages(mappedMessages)
    } catch (error) {
      // console.error('Error al cargar mensajes:', error)
      // Solo mostrar toast una vez
      if (!hasTriedToLoad) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los mensajes de contacto',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [auth?.token, toast, hasTriedToLoad])

  // Marcar mensaje como leído
  const markAsRead = async (messageId) => {
    try {
      // console.log('✅ Marcando mensaje como leído, ID:', messageId)
      
      const response = await axios.patch(`/api/contacts/${messageId}/mark-read`, {}, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      // console.log('📡 Respuesta del servidor para marcar como leído:', response.status, response.statusText)
      // console.log('✅ Respuesta del servidor:', response.data)

      // Verificar si la operación fue exitosa según la respuesta del backend
      if (response.data.success) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      )

      toast({
        title: 'Mensaje marcado como leído',
          description: response.data.message || 'El mensaje ha sido marcado como leído exitosamente',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      } else {
        throw new Error(response.data.message || 'Error al marcar como leído')
      }
    } catch (error) {
      // console.error('❌ Error al marcar como leído:', error)
      
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
      const statusCode = error.response?.status || 'N/A'
      
      toast({
        title: 'Error',
        description: `No se pudo marcar el mensaje como leído: ${errorMessage} (${statusCode})`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Eliminar mensaje
  const deleteMessage = async (messageId) => {
    try {
      // console.log('🗑️ Intentando eliminar mensaje con ID:', messageId)
      // console.log('📋 Mensajes actuales antes de eliminar:', messages.length)
      
      const response = await fetch(`/api/contacts/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al eliminar mensaje')
      }

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== messageId)
        // console.log('📋 Mensajes después de eliminar:', filtered.length)
        return filtered
      })

      toast({
        title: 'Mensaje eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      // console.error('Error al eliminar mensaje:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el mensaje',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Ver detalles del mensaje
  const viewMessage = (message) => {
    // console.log('👁️ Abriendo detalles del mensaje:', message)
    setSelectedMessage(message)
    onOpen()
    
    // NO marcar automáticamente como leído al ver detalles
    // El usuario debe hacer clic explícitamente en el botón "Marcar como Leído"
  }

  // Filtrar mensajes
  const filteredMessages = messages.filter(message => {
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      message.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.contact_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.contact_message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  // Contar mensajes no leídos
  const unreadCount = messages.filter(msg => msg.status === 'unread').length

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Efectos
  useEffect(() => {
    // Solo cargar una vez al montar el componente
    if (!hasInitialized.current) {
      hasInitialized.current = true
      fetchMessages()
      connectWebSocket()
    }

    return () => {
      // Limpiar listeners de Socket.IO
      webSocketService.off('new-contact')
      webSocketService.off('notification')
      webSocketService.off('connection-status')
    }
  }, [fetchMessages, connectWebSocket])

  // Efecto para monitorear cambios en los mensajes
  useEffect(() => {
    // console.log('📊 Estado de mensajes actualizado:', {
    //   total: messages.length,
    //   unread: messages.filter(msg => msg.status === 'unread').length,
    //   read: messages.filter(msg => msg.status === 'read').length
    // })
  }, [messages])


  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <Flex justify="center" align="center" minH="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Cargando mensajes de contacto...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <VStack align="stretch" spacing={4}>
              {/* Título */}
              <VStack align={{ base: "start", md: "start" }} spacing={2}>
                <Heading 
                  size={{ base: "md", md: "lg", lg: "xl" }} 
                  color="blue.600"
                >
                  Mensajes de Contacto
                </Heading>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Gestiona los mensajes enviados desde el formulario de contacto
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
                  onClick={onMenuOpen}
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
                <HStack spacing={2} display={{ base: "none", lg: "flex" }}>
                  <Avatar 
                    size={{ base: "sm", md: "md" }} 
                    name={auth?.user_name || auth?.name || 'Usuario'} 
                    bg="red.500" 
                  />
                  <VStack align="start" spacing={0} display={{ base: "none", xl: "flex" }}>
                    <HStack spacing={2}>
                      <Text fontWeight="medium" fontSize={{ base: "xs", md: "sm" }}>
                        {auth?.user_name || auth?.name || 'Usuario'}
                      </Text>
                      <Badge 
                        colorScheme="red" 
                        variant="solid" 
                        fontSize={{ base: "2xs", md: "xs" }}
                      >
                        {roleInfo.name.toUpperCase()}
                      </Badge>
                    </HStack>
                    <Text fontSize={{ base: "2xs", md: "sm" }} color={textColor}>
                      {auth?.user_email || auth?.email || 'usuario@radiofm.com'}
                    </Text>
                  </VStack>
                </HStack>
              </Flex>
            </VStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isMenuOpen}
            onClose={onMenuClose}
            currentPage="/dashboard/admin/contact-notifications"
          />

          {/* Estado de conexión y contadores */}
          <Box>
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "start", sm: "center" }}
              gap={3}
              mb={4}
            >
              <HStack spacing={2} flexWrap="wrap">
                {/* Estado de conexión WebSocket */}
                <Badge 
                  colorScheme={
                    connectionStatus === 'connected' ? 'green' : 
                    connectionStatus === 'error' ? 'red' : 
                    connectionStatus === 'disabled' ? 'gray' : 'yellow'
                  }
                  variant="subtle"
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {connectionStatus === 'connected' ? 'Conectado' : 
                   connectionStatus === 'error' ? 'Error' : 
                   connectionStatus === 'disabled' ? 'Deshabilitado' : 'Desconectado'}
                </Badge>
                
                {/* Botones de control WebSocket */}
                {connectionStatus === 'error' && (
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    colorScheme="blue"
                    variant="outline"
                    onClick={connectWebSocket}
                    fontSize={{ base: "2xs", md: "xs" }}
                  >
                    Reconectar
                  </Button>
                )}
                
                {connectionStatus === 'disabled' && (
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    colorScheme="green"
                    variant="outline"
                    onClick={connectWebSocket}
                    fontSize={{ base: "2xs", md: "xs" }}
                  >
                    Conectar
                  </Button>
                )}
                
                {/* Contador de mensajes no leídos */}
                {unreadCount > 0 && (
                  <Badge 
                    colorScheme="red" 
                    variant="solid"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {unreadCount} no leídos
                  </Badge>
                )}
              </HStack>
            </Flex>

            {/* Filtros y búsqueda */}
            <Card bg={cardBg} boxShadow="sm">
              <CardBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                <VStack spacing={3} align="stretch">
                  <HStack spacing={3} flexWrap="wrap">
                    <InputGroup flex={{ base: "1 1 100%", sm: "1 1 auto" }} minW={{ base: "100%", sm: "200px" }}>
                      <InputLeftElement>
                        <FiSearch color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size={{ base: "sm", md: "md" }}
                      />
                    </InputGroup>
                    
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      maxW={{ base: "100%", sm: "200px" }}
                      size={{ base: "sm", md: "md" }}
                    >
                      <option value="all">Todos</option>
                      <option value="unread">No leídos</option>
                      <option value="read">Leídos</option>
                    </Select>
                  </HStack>
                  
                  <HStack spacing={2} flexWrap="wrap">
                    <Button
                      leftIcon={<FiFilter />}
                      variant="outline"
                      onClick={() => {
                        setHasTriedToLoad(false)
                        fetchMessages()
                      }}
                      isLoading={loading}
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                    >
                      Actualizar
                    </Button>
                    
                    <Button
                      leftIcon={<FiMail />}
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => {
                        setHasTriedToLoad(false)
                        fetchMessages()
                      }}
                      isLoading={loading}
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                    >
                      <Text display={{ base: "none", sm: "block" }}>Recargar Mensajes</Text>
                      <Text display={{ base: "block", sm: "none" }}>Recargar</Text>
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Lista de mensajes */}
          <Card bg={cardBg} boxShadow="lg">
            <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
              <Heading size={{ base: "sm", md: "md" }}>
                Mensajes ({filteredMessages.length})
              </Heading>
            </CardHeader>
            <CardBody p={0} px={{ base: 3, md: 0 }}>
              {loading ? (
                <Box p={8} textAlign="center">
                  <VStack spacing={4}>
                    <Spinner size={{ base: "md", md: "lg" }} color="blue.500" />
                    <Text 
                      mt={4} 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Cargando mensajes...
                    </Text>
                  </VStack>
                </Box>
              ) : filteredMessages.length === 0 ? (
                <Box p={8} textAlign="center">
                  <FiMail size={48} color="gray" />
                  <Text 
                    mt={4} 
                    color={textColor} 
                    fontSize={{ base: "sm", md: "lg" }}
                  >
                    {messages.length === 0 
                      ? 'No hay mensajes de contacto aún' 
                      : 'No hay mensajes que coincidan con los filtros'
                    }
                  </Text>
                  {messages.length === 0 && (
                    <Text 
                      mt={2} 
                      color={textColor} 
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Los mensajes enviados desde el formulario de contacto aparecerán aquí
                    </Text>
                  )}
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size={{ base: "xs", md: "sm" }}>
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Nombre</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Teléfono
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Mensaje
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", xl: "table-cell" }}>
                          Fecha
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredMessages.map((message) => (
                        <Tr key={message.id}>
                          <Td>
                            <Badge 
                              colorScheme={message.status === 'unread' ? 'red' : 'green'}
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {message.status === 'unread' ? 'No leído' : 'Leído'}
                            </Badge>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <HStack spacing={2}>
                                <Avatar size={{ base: "xs", md: "sm" }} name={`${message.contact_name} ${message.contact_lastname}`} />
                                <VStack align="start" spacing={0}>
                                  <Text 
                                    fontWeight="medium"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    wordBreak="break-word"
                                  >
                                    {message.contact_name} {message.contact_lastname}
                                  </Text>
                                </VStack>
                              </HStack>
                              {/* Mostrar información adicional en móvil */}
                              <VStack align="start" spacing={1} mt={1} display={{ base: "flex", md: "none" }}>
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor}
                                  fontFamily="mono"
                                >
                                  📞 {message.contact_phone || 'No disponible'}
                                </Text>
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor}
                                  noOfLines={2}
                                >
                                  {message.contact_message}
                                </Text>
                                <HStack spacing={1}>
                                  <FiClock size={12} />
                                  <Text fontSize="2xs" color={textColor}>
                                    {formatDate(message.timestamp)}
                                  </Text>
                                </HStack>
                              </VStack>
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <Text 
                              fontSize={{ base: "xs", md: "sm" }} 
                              color={textColor}
                              fontFamily="mono"
                            >
                              {message.contact_phone || 'No disponible'}
                            </Text>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <Text 
                              noOfLines={2} 
                              maxW="300px"
                              color={textColor}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {message.contact_message}
                            </Text>
                          </Td>
                          <Td display={{ base: "none", xl: "table-cell" }}>
                            <HStack spacing={2}>
                              <FiClock size={14} />
                              <Text 
                                fontSize={{ base: "xs", md: "sm" }} 
                                color={textColor}
                              >
                                {formatDate(message.timestamp)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Tooltip 
                                label="Ver detalles del mensaje (solo lectura)"
                                hasArrow
                                placement="top"
                              >
                                <IconButton
                                  icon={<FiEye />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  colorScheme="blue"
                                  onClick={() => viewMessage(message)}
                                  aria-label="Ver detalles del mensaje"
                                />
                              </Tooltip>
                              
                              {message.status === 'unread' && (
                                <Tooltip label="Marcar como leído">
                                  <IconButton
                                    icon={<FiCheck />}
                                    size={{ base: "xs", md: "sm" }}
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => markAsRead(message.id)}
                                  />
                                </Tooltip>
                              )}
                              
                              <Tooltip label="Eliminar">
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => deleteMessage(message.id)}
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal para ver detalles del mensaje */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={{ base: "full", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>
            <HStack spacing={3} flexWrap="wrap">
              <FiMessageSquare />
              <VStack align="start" spacing={0}>
                <Text fontSize={{ base: "sm", md: "md" }}>Detalles del Mensaje</Text>
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.500" 
                  fontWeight="normal"
                >
                  Solo lectura - Para marcar como leído usa el botón correspondiente
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          {selectedMessage && (
            <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <VStack spacing={4} align="stretch">
                {/* Información del remitente */}
                <Card bg="gray.50">
                  <CardBody px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={4}
                    >
                      <Avatar 
                        size={{ base: "md", md: "lg" }} 
                        name={`${selectedMessage.contact_name} ${selectedMessage.contact_lastname}`} 
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text 
                          fontSize={{ base: "sm", md: "lg" }} 
                          fontWeight="bold"
                          wordBreak="break-word"
                        >
                          {selectedMessage.contact_name} {selectedMessage.contact_lastname}
                        </Text>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                          wordBreak="break-word"
                        >
                          📧 {selectedMessage.contact_email}
                        </Text>
                        {selectedMessage.contact_phone && (
                          <Text 
                            fontSize={{ base: "xs", md: "sm" }} 
                            color={textColor} 
                            fontFamily="mono"
                          >
                            📞 {selectedMessage.contact_phone}
                          </Text>
                        )}
                        <HStack spacing={2} flexWrap="wrap">
                          <HStack spacing={1}>
                            <FiClock size={12} />
                            <Text 
                              fontSize={{ base: "xs", md: "sm" }} 
                              color={textColor}
                            >
                              {formatDate(selectedMessage.timestamp)}
                            </Text>
                          </HStack>
                          <Badge 
                            colorScheme={selectedMessage.status === 'unread' ? 'red' : 'green'}
                            variant="subtle"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {selectedMessage.status === 'unread' ? 'No leído' : 'Leído'}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Mensaje */}
                <Box>
                  <Text 
                    fontWeight="semibold" 
                    mb={2}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Mensaje:
                  </Text>
                  <Box 
                    p={{ base: 3, md: 4 }} 
                    bg="gray.50" 
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor="blue.500"
                  >
                    <Text 
                      whiteSpace="pre-wrap"
                      fontSize={{ base: "xs", md: "sm" }}
                      wordBreak="break-word"
                    >
                      {selectedMessage.contact_message}
                    </Text>
                  </Box>
                </Box>
              </VStack>
            </ModalBody>
          )}
          
          <ModalFooter px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={2}
              w="100%"
            >
              <Button 
                variant="ghost" 
                onClick={onClose}
                flex={1}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
              >
                Cerrar
              </Button>
              {selectedMessage && selectedMessage.status === 'unread' && (
                <Button 
                  colorScheme="green" 
                  leftIcon={<FiCheck />}
                  onClick={() => {
                    markAsRead(selectedMessage.id)
                    onClose()
                  }}
                  variant="solid"
                  flex={1}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  Marcar como Leído
                </Button>
              )}
              
              {selectedMessage && selectedMessage.status === 'read' && (
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="green.600" 
                  fontWeight="medium"
                  alignSelf="center"
                >
                  ✓ Mensaje ya leído
                </Text>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default ContactNotifications
