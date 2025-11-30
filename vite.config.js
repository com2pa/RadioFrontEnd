import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red (permite localhost y 127.0.0.1)
    port: 5173, // Puerto por defecto
    strictPort: false, // Permitir usar otro puerto si 5173 está ocupado
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Configuración para mejorar rendimiento y manejo de cookies
        cookieDomainRewrite: '',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Agregar headers para mejor rendimiento
            proxyReq.setHeader('Connection', 'keep-alive');
          });
        },
      },
    },
  },
  // Configuración para preview (build de producción)
  preview: {
    host: '0.0.0.0',
    port: 8000,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Configuración para mejorar rendimiento y manejo de cookies
        cookieDomainRewrite: '',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Agregar headers para mejor rendimiento
            proxyReq.setHeader('Connection', 'keep-alive');
          });
        },
      },
    },
  },
})
