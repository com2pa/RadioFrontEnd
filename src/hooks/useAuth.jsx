import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Cargar datos del localStorage al inicializar
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return token && user ? { token, ...JSON.parse(user) } : null;
  });
  const navigate = useNavigate();

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignorar errores del endpoint de logout para permitir cierre local
    } finally {
      clearAuth();
      navigate('/', { replace: true });
    }
  };

  // Actualizar localStorage cuando cambia el estado de autenticación
  useEffect(() => {
    if (auth) {
      localStorage.setItem('authToken', auth.token);
      localStorage.setItem('user', JSON.stringify({
        name: auth.name,
        role: auth.role,
        email: auth.email,
        id: auth.id,
        role_id: auth.role_id
      }));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export { AuthProvider };