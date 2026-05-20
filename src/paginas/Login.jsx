import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const manejarLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    })

    if (error) {
      console.log(error)
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAF6F1' }}>

      {/* CASILLA CONTENEDORA (Aquí agregamos el fondo blanco, bordes y sombrado profundo) */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-auto flex flex-col items-center z-10 mt-6">

        {/* Logo */}
        <div className="mb-4">
          <img
            src="/logo.png"
            alt="Sabor del Chef"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: '#2C1810' }}>
          ¡Bienvenido a
        </h1>
        <h1 className="text-2xl font-extrabold text-center mb-2" style={{ color: '#8B1A1A' }}>
          Sabor del Chef!
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: '#7A6A60' }}>
          Inicia sesión para disfrutar<br />la mejor comida en tu puerta.
        </p>

        {/* Formulario */}
        <form onSubmit={manejarLogin} className="w-full flex flex-col gap-3">

          {/* Campo correo */}
          <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>

          {/* Campo contraseña */}
          <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={verContrasena ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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

          {/* Olvidaste contraseña */}
          <div className="text-right">
            <button type="button" className="text-xs font-semibold" style={{ color: '#8B1A1A' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-center font-semibold" style={{ color: '#C0392B' }}>
              {error}
            </p>
          )}

          {/* Botón iniciar sesión */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-4 rounded-xl text-white font-bold text-base mt-1 transition-opacity shadow-md"
            style={{ backgroundColor: '#8B1A1A', opacity: cargando ? 0.7 : 1 }}
          >
            {cargando ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center gap-3 w-full my-4">
          <div className="flex-1 h-px" style={{ backgroundColor: '#E0D6CE' }} />
          <span className="text-xs" style={{ color: '#9CA3AF' }}>o continúa con</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E0D6CE' }} />
        </div>

        {/* Botones sociales */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 border rounded-xl text-sm font-semibold shadow-sm"
            style={{ borderColor: '#E0D6CE', color: '#2C1810' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 border rounded-xl text-sm font-semibold shadow-sm"
            style={{ borderColor: '#E0D6CE', color: '#2C1810' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Registro */}
        <p className="text-sm mt-6 mb-2" style={{ color: '#7A6A60' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-bold" style={{ color: '#8B1A1A' }}>
            Regístrate
          </Link>
        </p>

      </div> {/* FIN DE LA CASILLA */}

      {/* Imagen hamburguesa inferior */}
      <div className="relative h-48 overflow-hidden mt-auto w-full">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #FAF6F1 0%, #8B1A1A 40%)',
          }}
        />
        <img
          src="/hamburguesa.png"
          alt="Hamburguesa"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 object-contain"
          style={{ zIndex: 1 }} />
      </div>

    </div>
  )
}
