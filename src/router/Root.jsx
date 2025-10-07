// router/Root.jsx - VERSIÓN CORREGIDA
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth' 
import PersistAuth from '../hooks/persistAuth'
import Public from './Public'
import Private from './Private'

const Root = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/*" element={<Public />} />
          
          {/* Rutas protegidas - CON PersistAuth */}
          <Route element={<PersistAuth />}>
            <Route path="/dashboard/*" element={<Private />} />
            <Route path="/admin/*" element={<Private />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Root