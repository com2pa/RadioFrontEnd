import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isAdmin = false;
    this.listeners = new Map();
    
    // IMPORTANTE: Cambiar esta URL según tu configuración
    this.serverUrl = 'http://localhost:3000'; // Puerto del backend
  }

  // Conectar al servidor WebSocket
  connect() {
    if (this.socket && this.isConnected) {
      console.log('🔌 Ya conectado al servidor WebSocket');
      return Promise.resolve();
    }

    console.log('🔌 Conectando a:', this.serverUrl);

    return new Promise((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        transports: ['polling', 'websocket'], // Cambiar orden: polling primero
        timeout: 10000, // Reducir timeout
        reconnection: true,
        reconnectionAttempts: 3, // Reducir intentos
        reconnectionDelay: 3000, // Reducir delay
        forceNew: true, // Forzar nueva conexión
        autoConnect: true
      });

      this.setupEventListeners();

      // Timeout para la conexión
      const connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          console.warn('⏰ Timeout de conexión WebSocket');
          reject(new Error('Timeout de conexión'));
        }
      }, 10000);

      this.socket.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log('✅ Conectado al WebSocket:', this.socket.id);
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        clearTimeout(connectionTimeout);
        console.error('❌ Error de conexión WebSocket:', error.message || error);
        
        // No rechazar inmediatamente, permitir que Socket.IO maneje la reconexión
        if (error.type === 'TransportError') {
          console.warn('🔄 Error de transporte, Socket.IO intentará reconectar automáticamente');
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Desconectado del WebSocket:', reason);
        this.isConnected = false;
      });
    });
  }

  // Configurar listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emit('connection-status', { connected: true, id: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.isAdmin = false;
      this.emit('connection-status', { connected: false, reason });
    });

    this.socket.on('notification', (notification) => {
      console.log('📢 Notificación recibida:', notification);
      this.emit('notification', notification);
    });

    this.socket.on('new_contact', (data) => {
      console.log('📞 Nuevo contacto:', data);
      this.emit('new-contact', data);
    });
  }

  // Unirse como administrador
  joinAdmin() {
    if (!this.socket || !this.isConnected) {
      console.error('❌ No hay conexión WebSocket');
      return false;
    }

    this.socket.emit('join-admin');
    this.isAdmin = true;
    console.log('👤 Unido como administrador');
    this.emit('admin-status', { isAdmin: true });
    return true;
  }

  // Sistema de eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en callback ${event}:`, error);
        }
      });
    }
  }

  // Obtener estado
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      isAdmin: this.isAdmin,
      socketId: this.socket ? this.socket.id : null
    };
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isAdmin = false;
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
