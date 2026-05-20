import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'
import NavInferior from '../componentes/NavInferior'

export default function Perfil() {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  
  // 1. Inyectamos datos de perfil de prueba para saltar la consulta a la base de datos
  const [perfil, setPerfil] = useState({
    full_name: "Carlos Mendoza",
    email: usuario?.email ?? "carlos.mendoza@email.com",
    phone: "+57 300 123 4567"
  })
  
  // Desactivamos el spinner inicial para maquetar de inmediato
  const [cargando, setCargando] = useState(false)
  const [cerrando, setCerrando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', usuario?.id)
        .single()
      if (data) {
        setPerfil(data)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const manejarCerrarSesion = async () => {
    setCerrando(true)
    if (cerrarSesion) await cerrarSesion()
    navigate('/login')
  }

  const iniciales = (nombre) => {
    if (!nombre) return '?'
    return nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  const OPCIONES = [
    {
      grupo: 'Mi cuenta',
      items: [
        { icono: '👤', label: 'Datos personales', accion: () => {} },
        { icono: '📍', label: 'Mis direcciones', accion: () => {} },
        { icono: '💳', label: 'Métodos de pago', accion: () => {} },
        { icono: '🔔', label: 'Notificaciones', accion: () => {} },
      ],
    },
    {
      grupo: 'Soporte',
      items: [
        { icono: '❓', label: 'Preguntas frecuentes', accion: () => {} },
        { icono: '🎧', label: 'Contactar soporte', accion: () => {} },
        { icono: '⭐', label: 'Calificar la app', accion: () => {} },
      ],
    },
    {
      grupo: 'Legal',
      items: [
        { icono: '📄', label: 'Términos y condiciones', accion: () => {} },
        { icono: '🔒', label: 'Política de privacidad', accion: () => {} },
      ],
    },
  ]

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-white shadow-sm">
        <h1 className="text-lg font-extrabold text-center" style={{ color: '#2C1810' }}>Perfil</h1>
      </div>

      {/* Tarjeta usuario (Modificada con casilla flotante shadow-md) */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-md border border-gray-100/50 flex items-center gap-4 transition-all hover:shadow-lg">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0 shadow-sm"
          style={{ backgroundColor: '#8B1A1A' }}
        >
          {iniciales(perfil?.full_name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-extrabold truncate" style={{ color: '#2C1810' }}>
            {perfil?.full_name ?? 'Usuario'}
          </p>
          <p className="text-xs truncate mt-0.5" style={{ color: '#9CA3AF' }}>
            {perfil?.email}
          </p>
          {perfil?.phone && (
            <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
              {perfil.phone}
            </p>
          )}
        </div>

        {/* Editar */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0 bg-gray-50 active:scale-95 transition-transform"
          style={{ borderColor: '#E0D6CE' }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* Stats rápidos (Modificados con sombreado shadow-md) */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3.5">
        {[
          { label: 'Pedidos', valor: '5', icono: '📦' },
          { label: 'Favoritos', valor: '3', icono: '❤️' },
          { label: 'Reseñas', valor: '2', icono: '⭐' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-3.5 shadow-md border border-gray-100/50 flex flex-col items-center gap-1 transition-all hover:shadow-lg">
            <span className="text-xl mb-0.5">{stat.icono}</span>
            <span className="text-lg font-black" style={{ color: '#2C1810' }}>{stat.valor}</span>
            <span className="text-[10px] font-bold text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Opciones (Modificadas con contenedores limpios shadow-md) */}
      <div className="px-4 mt-5 flex flex-col gap-4">
        {OPCIONES.map((grupo) => (
          <div key={grupo.grupo}>
            <p className="text-[10px] font-black mb-2 px-1 tracking-wider text-gray-400">
              {grupo.grupo.toUpperCase()}
            </p>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100/50 overflow-hidden">
              {grupo.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.accion}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                  style={{
                    borderBottom: i < grupo.items.length - 1 ? '1px solid #F0EAE4' : 'none',
                  }}
                >
                  <span className="text-lg w-6 text-center">{item.icono}</span>
                  <span className="flex-1 text-xs font-bold text-gray-700">
                    {item.label}
                  </span>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Botón cerrar sesión (Modificado con sombreado de elevación) */}
        <button
          onClick={manejarCerrarSesion}
          disabled={cerrando}
          className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 shadow-sm transition-all active:scale-[0.99] hover:bg-red-50/50"
          style={{
            borderColor: '#8B1A1A',
            color: '#8B1A1A',
            opacity: cerrando ? 0.7 : 1,
            backgroundColor: 'white',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
          </svg>
          {cerrando ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>

        {/* Versión */}
        <p className="text-center text-[11px] text-gray-400 pt-2 pb-4">
          Sabor del Chef v1.0.0
        </p>
      </div>

      <NavInferior />
    </div>
  )
}
