import { useState, useEffect, useContext, useCallback } from 'react';
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

  const clearAuth = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignorar errores del endpoint de logout para permitir cierre local
    } finally {
      clearAuth();
      navigate('/', { replace: true });
    }
  }, [clearAuth, navigate]);

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

  // Cierre automático por inactividad
  useEffect(() => {
    // Solo activar si hay un usuario autenticado
    if (!auth) return;

    // Tiempo de inactividad en milisegundos (30 minutos por defecto)
    const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutos
    
    let inactivityTimer;

    // Eventos que indican actividad del usuario
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    const resetTimer = () => {
      // Limpiar el timer anterior
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      // Crear nuevo timer
      inactivityTimer = setTimeout(() => {
        // Cerrar sesión automáticamente después del tiempo de inactividad
        logout();
      }, INACTIVITY_TIME);
    };

    // Inicializar el timer
    resetTimer();

    // Agregar listeners para detectar actividad
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer, true);
    });

    // Limpiar listeners y timer al desmontar o cuando cambie auth
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer, true);
      });
    };
  }, [auth, logout]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export { AuthProvider };