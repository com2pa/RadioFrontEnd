import React, { useState, useEffect, useCallback, useRef } from 'react'
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
        console.log('📨 Nueva notificación de contacto:', data)
        
        // Asegurar que el mensaje tenga la estructura correcta
        const messageData = {
          id: data.id || Date.now(),
          contact_name: data.contact_name,
          contact_lastname: data.contact_lastname,
          contact_email: data.contact_email,
          contact_message: data.contact_message,
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'unread'
        }
        
        setMessages(prev => [messageData, ...prev])
        
        toast({
          title: 'Nuevo mensaje de contacto',
          description: `${data.contact_name} ${data.contact_lastname} ha enviado un mensaje`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
      })

      // Escuchar notificaciones generales
      webSocketService.on('notification', (notification) => {
        console.log('📢 Notificación general recibida:', notification)
        
        // Si es una notificación de contacto, procesarla
        if (notification.type === 'contact' || notification.contact_name) {
          const messageData = {
            id: notification.id || Date.now(),
            contact_name: notification.contact_name,
            contact_lastname: notification.contact_lastname,
            contact_email: notification.contact_email,
            contact_message: notification.contact_message,
            timestamp: notification.timestamp || new Date().toISOString(),
            status: notification.status || 'unread'
          }
          
          setMessages(prev => [messageData, ...prev])
          
          toast({
            title: 'Nuevo mensaje de contacto',
            description: `${notification.contact_name} ${notification.contact_lastname} ha enviado un mensaje`,
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
      console.error('❌ Error al conectar WebSocket:', error)
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
      
      const response = await fetch('/api/contact-messages', {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar mensajes')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
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
      const response = await fetch(`/api/contact-messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al marcar como leído')
      }

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        )
      )

      toast({
        title: 'Mensaje marcado como leído',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error al marcar como leído:', error)
      toast({
        title: 'Error',
        description: 'No se pudo marcar el mensaje como leído',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Eliminar mensaje
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`/api/contact-messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Error al eliminar mensaje')
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId))

      toast({
        title: 'Mensaje eliminado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error al eliminar mensaje:', error)
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
    setSelectedMessage(message)
    onOpen()
    
    // Marcar como leído si no lo está
    if (message.status === 'unread') {
      markAsRead(message.id)
    }
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
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.600">
                  Mensajes de Contacto
                </Heading>
                <Text color={textColor}>
                  Gestiona los mensajes enviados desde el formulario de contacto
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<FiMenu />} onClick={onMenuOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<FiHome />} />
                <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
                <HStack spacing={4}>
                  <Avatar 
                    size="md" 
                    name={auth?.user_name || auth?.name || 'Usuario'} 
                    bg="red.500" 
                  />
                  <VStack align="start" spacing={0}>
                    <HStack spacing={2}>
                      <Text fontWeight="medium">
                        {auth?.user_name || auth?.name || 'Usuario'}
                      </Text>
                      <Badge 
                        colorScheme="red" 
                        variant="solid" 
                        fontSize="xs"
                      >
                        {roleInfo.name.toUpperCase()}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={textColor}>
                      {auth?.user_email || auth?.email || 'usuario@radiofm.com'}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
            </HStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isMenuOpen}
            onClose={onMenuClose}
            currentPage="/dashboard/admin/contact-notifications"
          />

          {/* Estado de conexión y contadores */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <HStack spacing={3}>
                {/* Estado de conexión WebSocket */}
                <Badge 
                  colorScheme={
                    connectionStatus === 'connected' ? 'green' : 
                    connectionStatus === 'error' ? 'red' : 
                    connectionStatus === 'disabled' ? 'gray' : 'yellow'
                  }
                  variant="subtle"
                >
                  {connectionStatus === 'connected' ? 'Conectado' : 
                   connectionStatus === 'error' ? 'Error' : 
                   connectionStatus === 'disabled' ? 'Deshabilitado' : 'Desconectado'}
                </Badge>
                
                {/* Botones de control WebSocket */}
                {connectionStatus === 'error' && (
                  <Button
                    size="xs"
                    colorScheme="blue"
                    variant="outline"
                    onClick={connectWebSocket}
                  >
                    Reconectar
                  </Button>
                )}
                
                {connectionStatus === 'disabled' && (
                  <Button
                    size="xs"
                    colorScheme="green"
                    variant="outline"
                    onClick={connectWebSocket}
                  >
                    Conectar WebSocket
                  </Button>
                )}
                
                
                {/* Contador de mensajes no leídos */}
                {unreadCount > 0 && (
                  <Badge colorScheme="red" variant="solid">
                    {unreadCount} no leídos
                  </Badge>
                )}
              </HStack>
            </HStack>

            {/* Filtros y búsqueda */}
            <Card bg={cardBg} boxShadow="sm">
              <CardBody>
                <HStack spacing={4} flexWrap="wrap">
                  <InputGroup maxW="300px">
                    <InputLeftElement>
                      <FiSearch color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar mensajes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    maxW="200px"
                  >
                    <option value="all">Todos</option>
                    <option value="unread">No leídos</option>
                    <option value="read">Leídos</option>
                  </Select>
                  
                  <Button
                    leftIcon={<FiFilter />}
                    variant="outline"
                    onClick={() => {
                      setHasTriedToLoad(false)
                      fetchMessages()
                    }}
                    isLoading={loading}
                  >
                    Actualizar
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </Box>

          {/* Lista de mensajes */}
          <Card bg={cardBg} boxShadow="lg">
            <CardHeader>
              <Heading size="md">
                Mensajes ({filteredMessages.length})
              </Heading>
            </CardHeader>
            <CardBody p={0}>
              {loading ? (
                <Box p={8} textAlign="center">
                  <Spinner size="lg" color="blue.500" />
                  <Text mt={4} color={textColor}>
                    Cargando mensajes...
                  </Text>
                </Box>
              ) : filteredMessages.length === 0 ? (
                <Box p={8} textAlign="center">
                  <FiMail size={48} color="gray" />
                  <Text mt={4} color={textColor} fontSize="lg">
                    {messages.length === 0 
                      ? 'No hay mensajes de contacto aún' 
                      : 'No hay mensajes que coincidan con los filtros'
                    }
                  </Text>
                  {messages.length === 0 && (
                    <Text mt={2} color={textColor} fontSize="sm">
                      Los mensajes enviados desde el formulario de contacto aparecerán aquí
                    </Text>
                  )}
                </Box>
              ) : (
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Estado</Th>
                        <Th>Nombre</Th>
                        <Th>Mensaje</Th>
                        <Th>Fecha</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredMessages.map((message) => (
                        <Tr key={message.id}>
                          <Td>
                            <Badge 
                              colorScheme={message.status === 'unread' ? 'red' : 'green'}
                              variant="subtle"
                            >
                              {message.status === 'unread' ? 'No leído' : 'Leído'}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar size="sm" name={`${message.contact_name} ${message.contact_lastname}`} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">
                                  {message.contact_name} {message.contact_lastname}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <Text 
                              noOfLines={2} 
                              maxW="300px"
                              color={textColor}
                            >
                              {message.contact_message}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <FiClock size={14} />
                              <Text fontSize="sm" color={textColor}>
                                {formatDate(message.timestamp)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Tooltip label="Ver detalles">
                                <IconButton
                                  icon={<FiEye />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="blue"
                                  onClick={() => viewMessage(message)}
                                />
                              </Tooltip>
                              
                              {message.status === 'unread' && (
                                <Tooltip label="Marcar como leído">
                                  <IconButton
                                    icon={<FiCheck />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => markAsRead(message.id)}
                                  />
                                </Tooltip>
                              )}
                              
                              <Tooltip label="Eliminar">
                                <IconButton
                                  icon={<FiTrash2 />}
                                  size="sm"
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
                </TableContainer>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal para ver detalles del mensaje */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <FiMessageSquare />
              <Text>Detalles del Mensaje</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          {selectedMessage && (
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {/* Información del remitente */}
                <Card bg="gray.50">
                  <CardBody>
                    <HStack spacing={4}>
                      <Avatar 
                        size="lg" 
                        name={`${selectedMessage.contact_name} ${selectedMessage.contact_lastname}`} 
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">
                          {selectedMessage.contact_name} {selectedMessage.contact_lastname}
                        </Text>
                        <HStack spacing={2}>
                          <FiClock size={14} />
                          <Text fontSize="sm" color={textColor}>
                            {formatDate(selectedMessage.timestamp)}
                          </Text>
                        </HStack>
                        <Badge 
                          colorScheme={selectedMessage.status === 'unread' ? 'red' : 'green'}
                          variant="subtle"
                        >
                          {selectedMessage.status === 'unread' ? 'No leído' : 'Leído'}
                        </Badge>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Mensaje */}
                <Box>
                  <Text fontWeight="semibold" mb={2}>Mensaje:</Text>
                  <Box 
                    p={4} 
                    bg="gray.50" 
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderLeftColor="blue.500"
                  >
                    <Text whiteSpace="pre-wrap">
                      {selectedMessage.contact_message}
                    </Text>
                  </Box>
                </Box>
              </VStack>
            </ModalBody>
          )}
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
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
              >
                Marcar como Leído
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default ContactNotifications
