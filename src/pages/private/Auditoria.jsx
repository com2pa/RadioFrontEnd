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
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure()

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
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={4}>
              <IconButton
                icon={<Icon as={FiMenu} />}
                aria-label="Menú"
                onClick={onMenuOpen}
                variant="ghost"
                size="md"
              />
              <Heading size="lg" color={textColor}>
                Auditoría
              </Heading>
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Recargar logs">
                <IconButton
                  icon={<Icon as={FiRefreshCw} />}
                  aria-label="Recargar"
                  onClick={() => fetchLogs(currentPage, limit)}
                  isLoading={loading}
                  variant="ghost"
                />
              </Tooltip>
              <Button
                as={RouterLink}
                to="/dashboard/admin"
                leftIcon={<Icon as={FiHome} />}
                variant="ghost"
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                onClick={logout}
                leftIcon={<Icon as={FiLogOut} />}
                colorScheme="red"
                variant="ghost"
                size="sm"
              >
                Salir
              </Button>
            </HStack>
          </HStack>

          {/* Filtros y búsqueda */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4} flexWrap="wrap">
                  {/* Búsqueda */}
                  <InputGroup flex={1} minW="200px">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar en logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>

                  {/* Filtro por acción */}
                  <Select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    maxW="200px"
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
                    maxW="200px"
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
                    maxW="150px"
                  >
                    <option value="10">10 por página</option>
                    <option value="20">20 por página</option>
                    <option value="50">50 por página</option>
                    <option value="100">100 por página</option>
                  </Select>
                </HStack>

                {/* Resumen */}
                <HStack spacing={4} flexWrap="wrap">
                  <Text fontSize="sm" color={textColor}>
                    Total de logs: <strong>{total}</strong>
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Mostrando: <strong>{logs.length}</strong> de <strong>{total}</strong>
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Tabla de logs */}
          <Card bg={cardBg}>
            <CardHeader>
              <HStack spacing={2}>
                <Icon as={FiFileText} />
                <Heading size="md">Logs de Auditoría</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Flex justify="center" align="center" py={8}>
                  <Spinner size="xl" />
                </Flex>
              ) : filteredLogs.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <AlertTitle>No hay logs disponibles</AlertTitle>
                  <AlertDescription>
                    {searchTerm || filterAction !== 'all' || filterUser !== 'all'
                      ? 'No se encontraron logs con los filtros aplicados'
                      : 'No hay registros de auditoría en el sistema'}
                  </AlertDescription>
                </Alert>
              ) : (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Fecha/Hora</Th>
                        <Th>Usuario</Th>
                        <Th>Acción</Th>
                        <Th>Detalles</Th>
                        <Th>IP</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredLogs.map((log, index) => (
                        <Tr key={log.log_id || log.id || index}>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={FiClock} color="gray.400" />
                              <Text fontSize="sm">
                                {formatDate(log.created_at || log.timestamp || log.date)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={FiUser} color="gray.400" />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium">
                                  {log.user_name 
                                    ? (log.user_lastname ? `${log.user_name} ${log.user_lastname}` : log.user_name)
                                    : (log.user_email || `Usuario ID: ${log.user_id || 'N/A'}` || 'Usuario desconocido')}
                                </Text>
                                {log.user_email && (
                                  <Text fontSize="xs" color="gray.500">
                                    {log.user_email}
                                  </Text>
                                )}
                                {log.user_id && !log.user_name && !log.user_email && (
                                  <Text fontSize="xs" color="gray.500">
                                    ID: {log.user_id}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme={getActionColor(log.action)}>
                                {log.action || 'N/A'}
                              </Badge>
                              {log.entity_type && (
                                <Text fontSize="xs" color="gray.500">
                                  {log.entity_type}
                                  {log.entity_id && ` #${log.entity_id}`}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              {log.metadata && typeof log.metadata === 'object' && (
                                <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                  {JSON.stringify(log.metadata)}
                                </Text>
                              )}
                              {log.user_agent && (
                                <Text fontSize="xs" color="gray.400" noOfLines={1}>
                                  {log.user_agent}
                                </Text>
                              )}
                              {!log.metadata && !log.user_agent && (
                                <Text fontSize="sm" color="gray.500">
                                  Sin descripción
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="xs" color="gray.500" fontFamily="mono">
                              {log.ip_address || log.ip || 'N/A'}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </CardBody>
            
            {/* Controles de paginación */}
            {!loading && totalPages > 1 && (
              <Box borderTop="1px solid" borderColor={cardBg === 'white' ? 'gray.200' : 'gray.700'} p={4}>
                <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<Icon as={FiChevronLeft} />}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      isDisabled={currentPage === 1 || loading}
                      variant="outline"
                    >
                      Anterior
                    </Button>
                    
                    {/* Números de página */}
                    <HStack spacing={1}>
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
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                            variant={currentPage === pageNum ? 'solid' : 'outline'}
                            minW="40px"
                            isDisabled={loading}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </HStack>
                    
                    <Button
                      size="sm"
                      rightIcon={<Icon as={FiChevronRight} />}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      isDisabled={currentPage === totalPages || loading}
                      variant="outline"
                    >
                      Siguiente
                    </Button>
                  </HStack>
                  
                  <Text fontSize="sm" color={textColor}>
                    Página {currentPage} de {totalPages} ({total} registros totales)
                  </Text>
                </HStack>
              </Box>
            )}
          </Card>
        </VStack>
      </Container>

      {/* Menú administrativo */}
      <AdminMenu
        isOpen={isMenuOpen}
        onClose={onMenuClose}
        currentPage="/dashboard/admin/auditoria"
        showHeader={true}
        showFooter={true}
        onLogout={logout}
      />
    </Box>
  )
}

export default Auditoria

