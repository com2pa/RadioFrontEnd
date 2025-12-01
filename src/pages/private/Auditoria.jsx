import React, { useState, useEffect, useCallback } from 'react'
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
  Divider,
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
  Tooltip,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FiFileText, 
  FiSearch, 
  FiFilter,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiMenu,
  FiHome,
  FiLogOut,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AdminMenu from '../../components/layout/AdminMenu'

const Auditoria = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { logout } = useAuth()

  // Estados
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(20)

  // Modal para el menú administrativo
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Obtener logs de auditoría
  const fetchLogs = useCallback(async (page = currentPage, itemsPerPage = limit) => {
    setLoading(true)
    try {
      const response = await axios.get('/api/activity-log/', {
        params: {
          page: page,
          limit: itemsPerPage
        }
      })
      // console.log('📋 [Auditoria] Respuesta completa:', response)
      // console.log('📋 [Auditoria] Logs obtenidos:', response.data)
      
      let logsData = []
      let paginationInfo = {
        page: page,
        limit: itemsPerPage,
        total: 0,
        totalPages: 1
      }
      
      // El backend devuelve: { success: true, data: { logs: [...], pagination: {...} } }
      if (response.data && response.data.success && response.data.data) {
        if (response.data.data.logs && Array.isArray(response.data.data.logs)) {
          logsData = response.data.data.logs
        } else if (Array.isArray(response.data.data)) {
          logsData = response.data.data
        }
        
        // Extraer información de paginación
        if (response.data.data.pagination) {
          paginationInfo = {
            page: response.data.data.pagination.page || page,
            limit: response.data.data.pagination.limit || itemsPerPage,
            total: response.data.data.pagination.total || 0,
            totalPages: response.data.data.pagination.totalPages || 1
          }
        }
      } else if (Array.isArray(response.data)) {
        logsData = response.data
      }
      
      // Aplanar la estructura del usuario (el backend devuelve user: { user_name, user_email, etc })
      logsData = logsData.map(log => {
        if (!log || typeof log !== 'object') return null
        
        // Si hay un objeto user, extraer sus propiedades al nivel principal
        if (log.user) {
          return {
            ...log,
            user_name: log.user.user_name || log.user_name || null,
            user_lastname: log.user.user_lastname || log.user_lastname || null,
            user_email: log.user.user_email || log.user_email || null
          }
        }
        
        return log
      }).filter(log => log !== null)
      
      // console.log('✅ [Auditoria] Logs procesados:', logsData.length)
      // console.log('📊 [Auditoria] Paginación:', paginationInfo)
      if (logsData.length > 0) {
        // console.log('📋 [Auditoria] Ejemplo de log procesado:', logsData[0])
      }
      
      setLogs(logsData)
      setCurrentPage(paginationInfo.page)
      setTotalPages(paginationInfo.totalPages)
      setTotal(paginationInfo.total)
      setLimit(paginationInfo.limit)
    } catch (error) {
      // console.error('❌ [Auditoria] Error obteniendo logs:', error)
      // console.error('❌ [Auditoria] Detalles del error:', {
      //   message: error.message,
      //   response: error.response?.data,
      //   status: error.response?.status,
      //   url: error.config?.url
      // })
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'No se pudieron cargar los logs de auditoría',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [toast, currentPage, limit])

  // Obtener usuarios únicos para el filtro
  useEffect(() => {
    if (logs && logs.length > 0) {
      const uniqueUsers = [...new Set(logs.map(log => {
        if (!log) return 'Desconocido'
        // Intentar obtener nombre completo o email
        const fullName = log.user_name 
          ? (log.user_lastname ? `${log.user_name} ${log.user_lastname}` : log.user_name)
          : null
        return fullName || log.user_email || `Usuario ID: ${log.user_id}` || 'Desconocido'
      }).filter(Boolean))]
      setUsers(uniqueUsers.sort())
    } else {
      setUsers([])
    }
  }, [logs])

  // Cargar logs al montar el componente
  useEffect(() => {
    fetchLogs(1, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar
  
  // Resetear a página 1 cuando cambian los filtros o el límite
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    } else {
      fetchLogs(1, limit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAction, filterUser, limit]) // Cuando cambian filtros o límite
  
  // Cargar logs cuando cambia la página
  useEffect(() => {
    if (currentPage > 0) {
      fetchLogs(currentPage, limit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]) // Cuando cambia la página

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    if (!log) return false
    
    // Filtro por acción
    if (filterAction !== 'all' && log.action !== filterAction) {
      return false
    }

    // Filtro por usuario
    if (filterUser !== 'all') {
      const fullName = log.user_name 
        ? (log.user_lastname ? `${log.user_name} ${log.user_lastname}` : log.user_name)
        : null
      const userName = fullName || log.user_email || `Usuario ID: ${log.user_id}` || 'Desconocido'
      if (userName !== filterUser) {
        return false
      }
    }

      // Búsqueda por término
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const fullName = log.user_name 
          ? (log.user_lastname ? `${log.user_name} ${log.user_lastname}` : log.user_name)
          : null
        const matchesSearch = 
          (log.description && String(log.description).toLowerCase().includes(searchLower)) ||
          (log.user_display && String(log.user_display).toLowerCase().includes(searchLower)) ||
          (log.action && String(log.action).toLowerCase().includes(searchLower)) ||
          (log.user_name && String(log.user_name).toLowerCase().includes(searchLower)) ||
          (log.user_lastname && String(log.user_lastname).toLowerCase().includes(searchLower)) ||
          (fullName && String(fullName).toLowerCase().includes(searchLower)) ||
          (log.user_email && String(log.user_email).toLowerCase().includes(searchLower)) ||
          (log.entity_type && String(log.entity_type).toLowerCase().includes(searchLower)) ||
          (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchLower)) ||
          (log.ip_address && String(log.ip_address).toLowerCase().includes(searchLower)) ||
          (log.user_agent && String(log.user_agent).toLowerCase().includes(searchLower))
        
        if (!matchesSearch) {
          return false
        }
      }

    return true
  })

  // Obtener acciones únicas para el filtro
  const uniqueActions = [...new Set(logs.filter(log => log && log.action).map(log => log.action).filter(Boolean))]

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Obtener color del badge según la acción
  const getActionColor = (action) => {
    if (!action) return 'gray'
    const actionLower = action.toLowerCase()
    if (actionLower.includes('create') || actionLower.includes('crear')) return 'green'
    if (actionLower.includes('update') || actionLower.includes('actualizar') || actionLower.includes('editar')) return 'blue'
    if (actionLower.includes('delete') || actionLower.includes('eliminar')) return 'red'
    if (actionLower.includes('login') || actionLower.includes('iniciar')) return 'purple'
    if (actionLower.includes('logout') || actionLower.includes('cerrar')) return 'orange'
    return 'gray'
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header del Dashboard */}
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
                    leftIcon={<Icon as={FiArrowLeft} />}
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
                    Auditoría
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Registro de actividades y acciones del sistema
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
                <Tooltip label="Recargar logs">
                  <IconButton
                    icon={<Icon as={FiRefreshCw} />}
                    aria-label="Recargar"
                    onClick={() => fetchLogs(currentPage, limit)}
                    isLoading={loading}
                    variant="ghost"
                    size={{ base: "sm", md: "md" }}
                  />
                </Tooltip>
                <IconButton 
                  aria-label="Abrir menú" 
                  icon={<Icon as={FiMenu} />} 
                  onClick={onOpen}
                  size={{ base: "sm", md: "md" }}
                />
                <IconButton 
                  as={RouterLink} 
                  to="/" 
                  aria-label="Inicio" 
                  icon={<Icon as={FiHome} />}
                  size={{ base: "sm", md: "md" }}
                />
                <Button 
                  leftIcon={<Icon as={FiLogOut} />} 
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

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/auditoria"
          />

          {/* Filtros y búsqueda */}
          <Card bg={cardBg}>
            <CardBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <VStack spacing={4} align="stretch">
                <VStack spacing={3} align="stretch">
                  {/* Búsqueda */}
                  <InputGroup flex={1} minW={{ base: "100%", sm: "200px" }}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar en logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size={{ base: "sm", md: "md" }}
                    />
                  </InputGroup>

                  <HStack spacing={3} flexWrap="wrap">
                    {/* Filtro por acción */}
                    <Select
                      value={filterAction}
                      onChange={(e) => setFilterAction(e.target.value)}
                      maxW={{ base: "100%", sm: "200px" }}
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                      size={{ base: "sm", md: "md" }}
                    >
                      <option value="all">Todas las acciones</option>
                      {uniqueActions.map(action => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </Select>

                    {/* Filtro por usuario */}
                    <Select
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                      maxW={{ base: "100%", sm: "200px" }}
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                      size={{ base: "sm", md: "md" }}
                    >
                      <option value="all">Todos los usuarios</option>
                      {users.map(user => (
                        <option key={user} value={user}>
                          {user}
                        </option>
                      ))}
                    </Select>

                    {/* Selector de items por página */}
                    <Select
                      value={limit}
                      onChange={(e) => {
                        const newLimit = parseInt(e.target.value)
                        setLimit(newLimit)
                        setCurrentPage(1)
                      }}
                      maxW={{ base: "100%", sm: "150px" }}
                      flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                      size={{ base: "sm", md: "md" }}
                    >
                      <option value="10">10 por página</option>
                      <option value="20">20 por página</option>
                      <option value="50">50 por página</option>
                      <option value="100">100 por página</option>
                    </Select>
                  </HStack>
                </VStack>

                {/* Resumen */}
                <HStack spacing={4} flexWrap="wrap">
                  <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                    Total de logs: <strong>{total}</strong>
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                    Mostrando: <strong>{logs.length}</strong> de <strong>{total}</strong>
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Tabla de logs */}
          <Card bg={cardBg}>
            <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
              <HStack spacing={2}>
                <Icon as={FiFileText} boxSize={{ base: 4, md: 5 }} />
                <Heading size={{ base: "sm", md: "md" }}>Logs de Auditoría</Heading>
              </HStack>
            </CardHeader>
            <CardBody px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
              {loading ? (
                <Flex justify="center" align="center" py={8}>
                  <VStack spacing={4}>
                    <Spinner size={{ base: "md", md: "xl" }} />
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Cargando logs...
                    </Text>
                  </VStack>
                </Flex>
              ) : filteredLogs.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize={{ base: "xs", md: "sm" }}>No hay logs disponibles</AlertTitle>
                    <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                      {searchTerm || filterAction !== 'all' || filterUser !== 'all'
                        ? 'No se encontraron logs con los filtros aplicados'
                        : 'No hay registros de auditoría en el sistema'}
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size={{ base: "xs", md: "sm" }}>
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Fecha/Hora</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Usuario</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Acción
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Descripción
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", xl: "table-cell" }}>
                          IP
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredLogs.map((log, index) => (
                        <Tr key={log.log_id || log.id || index}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <HStack spacing={1}>
                                <Icon as={FiClock} color="gray.400" boxSize={3} />
                                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
                                  {formatDate(log.created_at || log.timestamp || log.date)}
                                </Text>
                              </HStack>
                              <Text fontSize="2xs" color="gray.500" display={{ base: "block", md: "none" }}>
                                {new Date(log.created_at || log.timestamp || log.date).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <HStack spacing={1}>
                                <Icon as={FiUser} color="gray.400" boxSize={3} />
                                <VStack align="start" spacing={0}>
                                  {log.user_display ? (
                                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" wordBreak="break-word">
                                      {log.user_display}
                                    </Text>
                                  ) : (
                                    <>
                                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" wordBreak="break-word">
                                        {log.user_name 
                                          ? (log.user_lastname ? `${log.user_name} ${log.user_lastname}` : log.user_name)
                                          : (log.user_email || `Usuario ID: ${log.user_id || 'N/A'}` || 'Usuario desconocido')}
                                      </Text>
                                      {log.user_email && log.user_name && (
                                        <Text fontSize="2xs" color="gray.500" wordBreak="break-word">
                                          {log.user_email}
                                        </Text>
                                      )}
                                      {log.user_id && !log.user_name && !log.user_email && (
                                        <Text fontSize="2xs" color="gray.500">
                                          ID: {log.user_id}
                                        </Text>
                                      )}
                                    </>
                                  )}
                                </VStack>
                              </HStack>
                              {/* Mostrar información adicional en móvil */}
                              <VStack align="start" spacing={1} mt={1} display={{ base: "flex", md: "none" }}>
                                <Badge colorScheme={getActionColor(log.action)} fontSize="2xs">
                                  {log.action || 'N/A'}
                                </Badge>
                                {log.description && (
                                  <Text fontSize="2xs" color="gray.500" noOfLines={2}>
                                    {log.description}
                                  </Text>
                                )}
                                <Text fontSize="2xs" color="gray.500" fontFamily="mono">
                                  IP: {log.ip_address || log.ip || 'N/A'}
                                </Text>
                              </VStack>
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme={getActionColor(log.action)} fontSize={{ base: "2xs", md: "xs" }}>
                                {log.action || 'N/A'}
                              </Badge>
                              {log.entity_type && (
                                <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                                  {log.entity_type}
                                  {log.entity_id && ` #${log.entity_id}`}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <VStack align="start" spacing={1}>
                              {log.description ? (
                                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" fontWeight="medium" wordBreak="break-word">
                                  {log.description}
                                </Text>
                              ) : (
                                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" fontStyle="italic">
                                  Sin descripción disponible
                                </Text>
                              )}
                              {log.metadata && typeof log.metadata === 'object' && Object.keys(log.metadata).length > 0 && (
                                <Tooltip 
                                  label={JSON.stringify(log.metadata, null, 2)}
                                  placement="left"
                                  hasArrow
                                >
                                  <Text fontSize="2xs" color="gray.400" fontStyle="italic" cursor="help">
                                    Ver detalles técnicos
                                  </Text>
                                </Tooltip>
                              )}
                              {log.user_agent && (
                                <Text fontSize="2xs" color="gray.400" noOfLines={1} title={log.user_agent}>
                                  {log.user_agent.length > 50 ? `${log.user_agent.substring(0, 50)}...` : log.user_agent}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", xl: "table-cell" }}>
                            <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500" fontFamily="mono">
                              {log.ip_address || log.ip || 'N/A'}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
            
            {/* Controles de paginación */}
            {!loading && totalPages > 1 && (
              <Box 
                borderTop="1px solid" 
                borderColor={cardBg === 'white' ? 'gray.200' : 'gray.700'} 
                p={{ base: 3, md: 4 }}
              >
                <VStack spacing={3} align="stretch">
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", sm: "center" }}
                    gap={3}
                  >
                    <HStack spacing={2} flexWrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
                      <Button
                        size={{ base: "xs", md: "sm" }}
                        leftIcon={<Icon as={FiChevronLeft} />}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        isDisabled={currentPage === 1 || loading}
                        variant="outline"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Text display={{ base: "none", sm: "block" }}>Anterior</Text>
                        <Text display={{ base: "block", sm: "none" }}>Ant</Text>
                      </Button>
                      
                      {/* Números de página */}
                      <HStack spacing={1} flexWrap="wrap" justify="center">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              size={{ base: "xs", md: "sm" }}
                              onClick={() => setCurrentPage(pageNum)}
                              colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                              variant={currentPage === pageNum ? 'solid' : 'outline'}
                              minW={{ base: "32px", md: "40px" }}
                              isDisabled={loading}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </HStack>
                      
                      <Button
                        size={{ base: "xs", md: "sm" }}
                        rightIcon={<Icon as={FiChevronRight} />}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        isDisabled={currentPage === totalPages || loading}
                        variant="outline"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Text display={{ base: "none", sm: "block" }}>Siguiente</Text>
                        <Text display={{ base: "block", sm: "none" }}>Sig</Text>
                      </Button>
                    </HStack>
                    
                    <Text 
                      fontSize={{ base: "xs", md: "sm" }} 
                      color={textColor}
                      textAlign={{ base: "center", sm: "right" }}
                    >
                      Página {currentPage} de {totalPages} ({total} registros totales)
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            )}
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default Auditoria

