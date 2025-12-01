import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Flex,
  Avatar,
  useDisclosure,
  FormErrorMessage,
  Badge,
  Grid,
  GridItem,
  Spinner,
  Center,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { EditIcon, LockIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { isAdmin, getUserRoleInfo } from '../../utils/roleUtils';
import UserLayout from '../../components/layout/UserLayout';
import { validateField } from '../../utils/validations';
import AdminMenu from '../../components/layout/AdminMenu';
import { FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const ProfileUser = () => {
  const { auth, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estados separados para el menú lateral
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const toast = useToast();
  
  // Determinar si el usuario es administrador
  const userIsAdmin = auth ? isAdmin(auth) : false;
  const roleInfo = getUserRoleInfo(auth);
  
  // Colores y estilos para el layout de admin
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Obtener perfil del usuario
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        toast({
          title: 'Error de autenticación',
          description: 'No se encontró el token de autenticación',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get('/api/perfilUser/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success && response.data.data) {
        setUserProfile(response.data.data);
        setEditProfile(response.data.data);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      // console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cargar el perfil del usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Manejar cambios en el formulario de edición (memoizado para evitar re-renders)
  const handleInputChange = useCallback((field, value) => {
    setEditProfile(prev => {
      if (!prev) return prev;
      // Solo actualizar si el valor realmente cambió
      if (prev[field] === value) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Limpiar error del campo si existe (solo si hay error) - usando batch update
    setErrors(prev => {
      if (!prev[field]) return prev;
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Handlers específicos para cada campo (memoizados para mejor rendimiento)
  const handleNameChange = useCallback((e) => handleInputChange('user_name', e.target.value), [handleInputChange]);
  const handleLastnameChange = useCallback((e) => handleInputChange('user_lastname', e.target.value), [handleInputChange]);
  const handleEmailChange = useCallback((e) => handleInputChange('user_email', e.target.value), [handleInputChange]);
  const handlePhoneChange = useCallback((e) => handleInputChange('user_phone', e.target.value), [handleInputChange]);
  const handleAddressChange = useCallback((e) => handleInputChange('user_address', e.target.value), [handleInputChange]);
  const handleAgeChange = useCallback((e) => {
    const val = e.target.value;
    handleInputChange('user_age', val === '' ? '' : parseInt(val) || '');
  }, [handleInputChange]);

  // Validar formulario usando las validaciones existentes (optimizado)
  const validateForm = () => {
    if (!editProfile) {
      setErrors({ general: 'No hay datos de perfil para validar' });
      return false;
    }
    
    const newErrors = {};
    
    // Validación rápida de campos requeridos primero
    if (!editProfile.user_name?.trim()) {
      newErrors.user_name = 'El nombre es requerido';
    }
    if (!editProfile.user_lastname?.trim()) {
      newErrors.user_lastname = 'El apellido es requerido';
    }
    if (!editProfile.user_email?.trim()) {
      newErrors.user_email = 'El email es requerido';
    }
    if (!editProfile.user_phone?.trim()) {
      newErrors.user_phone = 'El teléfono es requerido';
    }
    
    // Si hay errores de campos requeridos, retornar inmediatamente
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // Validar formato solo si los campos requeridos están presentes
    const nameValidation = validateField('name', editProfile.user_name.trim());
    if (!nameValidation.isValid) {
      newErrors.user_name = nameValidation.message;
    }

    const lastnameValidation = validateField('lastname', editProfile.user_lastname.trim());
    if (!lastnameValidation.isValid) {
      newErrors.user_lastname = lastnameValidation.message;
    }

    const emailValidation = validateField('email', editProfile.user_email.trim());
    if (!emailValidation.isValid) {
      newErrors.user_email = emailValidation.message;
    }

    const phoneValidation = validateField('phone', editProfile.user_phone.trim());
    if (!phoneValidation.isValid) {
      newErrors.user_phone = phoneValidation.message;
    }

    // Validar campos opcionales solo si tienen valor
    if (editProfile.user_address?.trim()) {
      const addressValidation = validateField('address', editProfile.user_address.trim());
      if (!addressValidation.isValid) {
        newErrors.user_address = addressValidation.message;
      }
    }

    if (editProfile.user_age) {
      const ageValidation = validateField('age', String(editProfile.user_age));
      if (!ageValidation.isValid) {
        newErrors.user_age = ageValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actualizar perfil con actualización optimista
  const handleUpdateProfile = async () => {
    if (!editProfile) {
      toast({
        title: 'Error',
        description: 'No hay datos de perfil para actualizar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor corrige los errores en el formulario',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      toast({
        title: 'Error de autenticación',
        description: 'No se encontró el token de autenticación',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Guardar el estado anterior para poder revertir en caso de error
    const previousProfile = { ...userProfile };
    
    // Preparar los datos a enviar - optimizado para velocidad
    const updateData = {
      user_name: editProfile.user_name?.trim() || '',
      user_lastname: editProfile.user_lastname?.trim() || '',
      user_email: editProfile.user_email?.trim() || '',
      user_phone: editProfile.user_phone?.trim() || ''
    };
    
    // Campos opcionales - incluir solo si tienen valor
    if (editProfile.user_address !== undefined && editProfile.user_address !== null) {
      updateData.user_address = editProfile.user_address.trim() || null;
    }
    if (editProfile.user_age !== undefined && editProfile.user_age !== null) {
      updateData.user_age = editProfile.user_age;
    }
    
    // console.log('📤 [Frontend] Enviando datos de actualización:', updateData);

    // ACTUALIZACIÓN OPTIMISTA: Actualizar el estado inmediatamente
    const optimisticUpdate = {
      ...userProfile,
      ...updateData,
      user_updated_at: new Date().toISOString()
    };
    
    setUserProfile(optimisticUpdate);
    setEditProfile(optimisticUpdate);
    setIsEditing(false);
    setErrors({});
    setIsUpdating(false); // Asegurar que el botón no esté bloqueado
    
    // Mostrar toast de éxito inmediatamente
    toast({
      title: 'Perfil actualizado',
      description: 'Tu perfil se ha actualizado correctamente',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    // Enviar la petición en segundo plano (sin bloquear la UI ni el botón)
    // Usar una función async sin await para no bloquear
    (async () => {
      try {
        const response = await axios.put('/api/perfilUser/profile', updateData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.data) {
          // Actualizar con los datos reales del servidor (silenciosamente)
          setUserProfile(response.data.data);
          setEditProfile(response.data.data);
          // console.log('✅ [Frontend] Perfil guardado exitosamente en el servidor');
        } else {
          // Si la respuesta no es exitosa, revertir cambios y notificar
          setUserProfile(previousProfile);
          setEditProfile(previousProfile);
          // console.error('❌ [Frontend] Error en respuesta del servidor:', response.data.message);
          toast({
            title: 'Error al guardar',
            description: response.data.message || 'No se pudo guardar los cambios en el servidor',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (error) {
        // Revertir cambios en caso de error y notificar
        setUserProfile(previousProfile);
        setEditProfile(previousProfile);
        
        // console.error('❌ [Frontend] Error updating profile:', error);
        toast({
          title: 'Error al guardar',
          description: error.response?.data?.message || error.message || 'No se pudo guardar los cambios. Por favor intenta de nuevo.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    })();
  };


  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Componente de contenido del perfil
  const ProfileContent = () => {
    if (isLoading) {
      return (
        <Center minH="60vh">
          <VStack spacing={4}>
            <Spinner size={{ base: "lg", md: "xl" }} color="blue.500" />
            <Text fontSize={{ base: "sm", md: "md" }}>Cargando perfil...</Text>
          </VStack>
        </Center>
      );
    }

    if (!userProfile) {
      return (
        <Center minH="60vh">
          <VStack spacing={4}>
            <Text fontSize={{ base: "sm", md: "lg" }} color="gray.500">No se pudo cargar el perfil del usuario</Text>
            <Button 
              onClick={fetchUserProfile} 
              colorScheme="blue"
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Reintentar
            </Button>
          </VStack>
        </Center>
      );
    }

    return (
      <Container maxW="6xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
        {/* Header del perfil */}
        <Card>
          <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
            <VStack align="start" spacing={2}>
              <Heading size={{ base: "md", md: "lg", lg: "xl" }}>Mi Perfil</Heading>
              <Text 
                color="gray.600"
                fontSize={{ base: "sm", md: "md" }}
              >
                Gestiona tu información personal y configuración de cuenta
              </Text>
            </VStack>
          </CardHeader>
        </Card>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={{ base: 4, md: 6, lg: 8 }}>
          {/* Información principal */}
          <GridItem>
            <Card>
              <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
                <Flex 
                  justify="space-between" 
                  align={{ base: "start", sm: "center" }}
                  direction={{ base: "column", sm: "row" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>Información Personal</Heading>
                  {!isEditing ? (
                    <Button
                      leftIcon={<EditIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      w={{ base: "100%", sm: "auto" }}
                    >
                      Editar Perfil
                    </Button>
                  ) : (
                    <HStack spacing={2} w={{ base: "100%", sm: "auto" }}>
                      <Button
                        leftIcon={<CheckIcon />}
                        colorScheme="green"
                        onClick={handleUpdateProfile}
                        isLoading={isUpdating}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                        flex={1}
                      >
                        Guardar
                      </Button>
                      <Button
                        leftIcon={<CloseIcon />}
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditProfile(userProfile);
                          setErrors({});
                        }}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                        flex={1}
                      >
                        Cancelar
                      </Button>
                    </HStack>
                  )}
                </Flex>
              </CardHeader>
              <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                  {/* Avatar y nombre */}
                  <Flex 
                    gap={{ base: 3, md: 6 }} 
                    align="center"
                    direction={{ base: "column", sm: "row" }}
                  >
                    <Avatar
                      size={{ base: "lg", md: "xl" }}
                      name={`${userProfile.user_name} ${userProfile.user_lastname}`}
                      bg="blue.500"
                      color="white"
                    />
                    <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                      <Heading size={{ base: "sm", md: "md" }} textAlign={{ base: "center", sm: "left" }}>
                        {userProfile.user_name} {userProfile.user_lastname}
                      </Heading>
                      <Text 
                        color="gray.600"
                        fontSize={{ base: "xs", md: "sm" }}
                        textAlign={{ base: "center", sm: "left" }}
                        wordBreak="break-word"
                      >
                        {userProfile.user_email}
                      </Text>
                      <Badge 
                        colorScheme="blue" 
                        variant="subtle"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {userProfile.role_name}
                      </Badge>
                    </VStack>
                  </Flex>

                  <Divider />

                  {/* Formulario de edición */}
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 3, md: 4 }}>
                    <FormControl isInvalid={!!errors.user_name}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Nombre</FormLabel>
                      <Input
                        value={editProfile?.user_name ?? ''}
                        onChange={handleNameChange}
                        isDisabled={!isEditing}
                        placeholder="Tu nombre"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.user_lastname}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Apellido</FormLabel>
                      <Input
                        value={editProfile?.user_lastname ?? ''}
                        onChange={handleLastnameChange}
                        isDisabled={!isEditing}
                        placeholder="Tu apellido"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_lastname}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.user_email}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Email</FormLabel>
                      <Input
                        type="email"
                        value={editProfile?.user_email ?? ''}
                        onChange={handleEmailChange}
                        isDisabled={!isEditing}
                        placeholder="tu@email.com"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.user_phone}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Teléfono</FormLabel>
                      <Input
                        value={editProfile?.user_phone ?? ''}
                        onChange={handlePhoneChange}
                        isDisabled={!isEditing}
                        placeholder="+1 234 567 890"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_phone}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.user_age}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Edad</FormLabel>
                      <Input
                        type="number"
                        value={editProfile?.user_age ?? ''}
                        onChange={handleAgeChange}
                        isDisabled={!isEditing}
                        placeholder="25"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_age}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.user_address}>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Dirección</FormLabel>
                      <Input
                        value={editProfile?.user_address ?? ''}
                        onChange={handleAddressChange}
                        isDisabled={!isEditing}
                        placeholder="Tu dirección completa"
                        size={{ base: "sm", md: "md" }}
                      />
                      <FormErrorMessage fontSize={{ base: "xs", md: "sm" }}>{errors.user_address}</FormErrorMessage>
                    </FormControl>
                  </Grid>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Panel lateral */}
          <GridItem>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Información de la cuenta */}
              <Card>
                <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>Información de la Cuenta</Heading>
                </CardHeader>
                <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Estado de la cuenta</Text>
                      <Flex align="center" justify="space-between" mt={1}>
                        <Text 
                          fontWeight="medium"
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {userProfile.user_status ? "Activa" : "Inactiva"}
                        </Text>
                        <Badge 
                          colorScheme={userProfile.user_status ? "green" : "red"}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {userProfile.user_status ? "✓ Activa" : "✗ Inactiva"}
                        </Badge>
                      </Flex>
                    </Box>

                    <Box>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Miembro desde</Text>
                      <Text 
                        fontWeight="medium"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {formatDate(userProfile.user_created_at)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">Última actualización</Text>
                      <Text 
                        fontWeight="medium"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {formatDate(userProfile.user_updated_at)}
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Acciones rápidas */}
              <Card>
                <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>Acciones Rápidas</Heading>
                </CardHeader>
                <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                  <VStack spacing={3} align="stretch">
                    <Button
                      as={RouterLink}
                      to={userIsAdmin ? "/dashboard/admin/change-password" : "/dashboard/user/change-password"}
                      leftIcon={<LockIcon />}
                      variant="outline"
                      colorScheme="blue"
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      w="100%"
                    >
                      Cambiar Contraseña
                    </Button>
                    
                    <Button
                      variant="outline"
                      colorScheme="orange"
                      onClick={() => {
                        // Función para reenviar verificación de email
                        toast({
                          title: 'Funcionalidad en desarrollo',
                          description: 'Reenviar verificación de email',
                          status: 'info',
                          duration: 3000,
                        });
                      }}
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      w="100%"
                    >
                      Reenviar Verificación
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>

      </Container>
    );
  };

  // Renderizar con el layout apropiado según el tipo de usuario
  if (userIsAdmin) {
    // Para administradores, usar layout con menú (similar a otras páginas admin)
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
            {/* Header con menú para administradores */}
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
                      color="blue.600"
                    >
                      Mi Perfil
                    </Heading>
                    <Badge 
                      colorScheme="blue" 
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
                    Gestiona tu información personal y configuración de cuenta
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
                </Flex>
              </VStack>
            </Box>

            {/* Menú administrativo */}
            <AdminMenu 
              isOpen={isMenuOpen}
              onClose={onMenuClose}
              currentPage="/dashboard/admin/profile"
            />

            <ProfileContent />
          </VStack>
        </Container>
      </Box>
    );
  } else {
    // Para suscriptores, usar UserLayout
    return (
      <UserLayout 
        title="Mi Perfil"
        subtitle="Gestiona tu información personal y configuración de cuenta"
      >
        <ProfileContent />
      </UserLayout>
    );
  }
};

export default ProfileUser;