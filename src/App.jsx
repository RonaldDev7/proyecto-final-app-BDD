import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexto/AuthContexto'

import Login           from './paginas/Login'
import Registro        from './paginas/Registro'
import Inicio          from './paginas/Inicio'
import Menu            from './paginas/Menu'
import DetalleProducto from './paginas/DetalleProducto'
import Carrito         from './paginas/Carrito'
import Pedidos         from './paginas/Pedidos'
import Perfil          from './paginas/Perfil'
// 1. Importamos la nueva vista de reservas
import Reservas        from './paginas/Reservas'

// Desactivamos el bloqueo: Ahora siempre deja pasar
function RutaPrivada({ children }) {
  return children 
}

// Desactivamos el bloqueo: Ahora no te regresa si estás en login/registro
function RutaPublica({ children }) {
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"        element={<RutaPublica><Login /></RutaPublica>} />
          <Route path="/registro"     element={<RutaPublica><Registro /></RutaPublica>} />
          <Route path="/"             element={<RutaPrivada><Inicio /></RutaPrivada>} />
          <Route path="/menu"         element={<RutaPrivada><Menu /></RutaPrivada>} />
          <Route path="/producto/:id" element={<RutaPrivada><DetalleProducto /></RutaPrivada>} />
          <Route path="/carrito"      element={<RutaPrivada><Carrito /></RutaPrivada>} />
          <Route path="/pedidos"      element={<RutaPrivada><Pedidos /></RutaPrivada>} />
          <Route path="/perfil"       element={<RutaPrivada><Perfil /></RutaPrivada>} />
          
          {/* 2. Añadimos la nueva ruta de Reservas en el listado */}
          <Route path="/reservas"     element={<RutaPrivada><Reservas /></RutaPrivada>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
