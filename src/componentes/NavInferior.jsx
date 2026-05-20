import { Link, useLocation } from 'react-router-dom'

const items = [
  {
    ruta: '/',
    etiqueta: 'Inicio',
    icono: (activo) => (
      <svg width="22" height="22" fill={activo ? '#8B1A1A' : 'none'} viewBox="0 0 24 24" stroke={activo ? '#8B1A1A' : '#9CA3AF'} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    ruta: '/menu',
    etiqueta: 'Menú',
    icono: (activo) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={activo ? '#8B1A1A' : '#9CA3AF'} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    ruta: '/carrito',
    etiqueta: 'Carrito',
    icono: (activo) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={activo ? '#8B1A1A' : '#9CA3AF'} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    badge: 3,
  },
  {
    ruta: '/pedidos',
    etiqueta: 'Pedidos',
    icono: (activo) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={activo ? '#8B1A1A' : '#9CA3AF'} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    ruta: '/perfil',
    etiqueta: 'Perfil',
    icono: (activo) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={activo ? '#8B1A1A' : '#9CA3AF'} strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function NavInferior() {
  const { pathname } = useLocation()

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t flex justify-around items-center py-2 z-50"
      style={{ borderColor: '#E0D6CE' }}
    >
      {items.map(({ ruta, etiqueta, icono, badge }) => {
        const activo = pathname === ruta
        return (
          <Link key={ruta} to={ruta} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
            {icono(activo)}
            {badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#8B1A1A' }}>
                {badge}
              </span>
            )}
            <span className="text-[10px] font-semibold" style={{ color: activo ? '#8B1A1A' : '#9CA3AF' }}>
              {etiqueta}
            </span>
          </Link>
        )
      })}
    </div>
  )
}