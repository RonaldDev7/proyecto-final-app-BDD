import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmar: '',
  })
  const [verContrasena, setVerContrasena] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const manejarRegistro = async (e) => {
    e.preventDefault()
    setError('')

    if (form.contrasena !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.correo,
      password: form.contrasena,
    })

    if (authError) {
      setError('Error al registrarse. Intenta de nuevo.')
      setCargando(false)
      return
    }

    // Guardar datos extra en tabla users
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        full_name: form.nombre,
        email: form.correo,
        phone: form.telefono,
      })
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-6">

        {/* Logo */}
        <img
          src="/logo.png"
          alt="Sabor del Chef"
          className="w-28 h-28 object-contain mb-4"
        />

        {/* Título */}
        <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: '#2C1810' }}>
          ¡Crea tu cuenta!
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: '#7A6A60' }}>
          Regístrate y disfruta la mejor<br />comida en tu puerta.
        </p>

        {/* Formulario */}
        <form onSubmit={manejarRegistro} className="w-full flex flex-col gap-3">

          {/* Nombre completo */}
          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={manejarCambio}
              required
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>

          {/* Correo */}
          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={manejarCambio}
              required
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.05 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
            </svg>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={manejarCambio}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>

          {/* Contraseña */}
          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={verContrasena ? 'text' : 'password'}
              name="contrasena"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={manejarCambio}
              required
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
            <button type="button" onClick={() => setVerContrasena(!verContrasena)}>
              {verContrasena ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar contraseña"
              value={form.confirmar}
              onChange={manejarCambio}
              required
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-center font-semibold" style={{ color: '#C0392B' }}>
              {error}
            </p>
          )}

          {/* Botón registrarse */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-4 rounded-xl text-white font-bold text-base mt-1 transition-opacity"
            style={{ backgroundColor: '#8B1A1A', opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Login */}
        <p className="text-sm mt-5" style={{ color: '#7A6A60' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold" style={{ color: '#8B1A1A' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}