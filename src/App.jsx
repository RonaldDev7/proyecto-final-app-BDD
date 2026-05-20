import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexto/AuthContexto'

import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Inicio from './paginas/Inicio'
import Menu from './paginas/Menu'
import DetalleProducto from './paginas/DetalleProducto'
import Carrito from './paginas/Carrito'
import Pedidos from './paginas/Pedidos'
import Perfil from './paginas/Perfil'

import Reservas from './paginas/Reservas'
import { CarritoProvider } from './contexto/CarritoContexto'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><Inicio /></PrivateRoute>} />
            <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
            <Route path="/producto/:id" element={<PrivateRoute><DetalleProducto /></PrivateRoute>} />
            <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
            <Route path="/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  )
}
