// components/PersistAuth.jsx - VERSIÓN SIMPLIFICADA
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { HashLoader } from 'react-spinners';

const PersistAuth = () => {
  const { auth, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 PersistAuth - Checking authentication...');
    
    // Simular verificación de token (reemplaza con tu lógica real)
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        console.log('📦 PersistAuth - LocalStorage:', { token, userData });
        
        if (token && userData) {
          // Si hay datos en localStorage pero no en el estado, actualizar el estado
          if (!auth) {
            const user = JSON.parse(userData);
            setAuth({ token, ...user });
            console.log('✅ PersistAuth - Auth state updated from localStorage');
          }
        }
      } catch (error) {
        console.error('❌ PersistAuth - Error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
        console.log('🏁 PersistAuth - Loading complete');
      }
    };

    verifyAuth();
  }, [auth, setAuth]);

  if (isLoading) {
    console.log('⏳ PersistAuth - Showing loader');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <HashLoader color="red" loading size={90} speedMultiplier={2} />
      </Box>
    );
  }

  console.log('🚀 PersistAuth - Rendering protected routes');
  return <Outlet />;
};

export default PersistAuth;