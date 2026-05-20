import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'
import NavInferior from '../componentes/NavInferior'

const TABS = [
  { id: 'todos',          label: 'Todos' },
  { id: 'pending',        label: 'En preparación' },
  { id: 'on_the_way',    label: 'En camino' },
  { id: 'delivered',     label: 'Entregados' },
  { id: 'cancelled',     label: 'Cancelados' },
]

const ESTADO_CONFIG = {
  pending:     { label: 'En preparación', color: '#F5A623', bg: '#FEF3C7', paso: 0 },
  on_the_way:  { label: 'En camino',      color: '#3B82F6', bg: '#DBEAFE', paso: 1 },
  delivered:   { label: 'Entregado',      color: '#22C55E', bg: '#DCFCE7', paso: 2 },
  cancelled:   { label: 'Cancelado',      color: '#9CA3AF', bg: '#F3F4F6', paso: -1 },
}

const MENSAJES = {
  pending:    'Tu pedido está siendo preparado por nuestros chefs.',
  on_the_way: 'Tu pedido va en camino. ¡Llegará pronto!',
  delivered:  'Tu pedido fue entregado exitosamente.',
  cancelled:  'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.',
}

function PasosPedido({ estado }) {
  const paso = ESTADO_CONFIG[estado]?.paso ?? 0
  const pasos = [
    { icono: '👨‍🍳' },
    { icono: '🛵' },
    { icono: '✓' },
  ]

  if (estado === 'cancelled') return null

  return (
    <div className="flex items-center gap-1 my-2">
      {pasos.map((p, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all"
            style={{
              borderColor: i <= paso ? '#8B1A1A' : '#E0D6CE',
              backgroundColor: i <= paso ? '#FFF0F0' : 'white',
            }}
          >
            {p.icono}
          </div>
          {i < pasos.length - 1 && (
            <div className="flex gap-0.5">
              {[0, 1, 2].map((d) => (
                <div key={d} className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: i < paso ? '#8B1A1A' : '#E0D6CE' }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Pedidos() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  // 1. Inyectamos pedidos locales ficticios enlazados a tus imágenes de public
  const [pedidos, setPedidos] = useState([
    {
      id: "1024",
      status: "pending",
      created_at: new Date().toISOString(),
      total: 33000,
      order_items: [
        { products: { name: "Hamburguesa Especial", image_url: "/HamburguesaEspecial.png" } },
        { products: { name: "Limonada Natural Cerezada", image_url: "/LimonadaCerezada.png" } }
      ]
    },
    {
      id: "0982",
      status: "delivered",
      created_at: new Date(Date.now() - 86400000).toISOString(), // Ayer
      total: 42000,
      order_items: [
        { products: { name: "Pizza Pepperoni madurada", image_url: "/Pizza Pepperoni madurada.webp" } },
        { products: { name: "Papas Fritas Crujientes", image_url: "/papas.webp" } }
      ]
    }
  ])
  
  const [tabActiva, setTabActiva] = useState('todos')
  
  // Desactivamos cargando para maquetar la interfaz inmediatamente
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('user_id', usuario?.id)
        .order('created_at', { ascending: false })
      if (data && data.length > 0) {
        setPedidos(data)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const pedidosFiltrados = pedidos.filter((p) =>
    tabActiva === 'todos' ? true : p.status === tabActiva
  )

  const formatearFecha = (fecha) => {
    const d = new Date(fecha)
    return d.toLocaleDateString('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric'
    }) + ' • ' + d.toLocaleTimeString('es-CO', {
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-white shadow-sm">
        <button>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-extrabold" style={{ color: '#2C1810' }}>Mis Pedidos</h1>
        <button className="relative">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#8B1A1A' }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide bg-white border-b px-4"
        style={{ borderColor: '#E0D6CE' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className="flex-shrink-0 py-3 px-3 text-xs font-bold border-b-2 transition-all"
            style={{
              borderColor: tabActiva === tab.id ? '#8B1A1A' : 'transparent',
              color: tabActiva === tab.id ? '#8B1A1A' : '#9CA3AF',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista pedidos */}
      <div className="px-4 pt-4 flex flex-col gap-4">
        {cargando ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-bold mb-1" style={{ color: '#2C1810' }}>Sin pedidos</p>
            <p className="text-sm text-gray-400" style={{ color: '#9CA3AF' }}>
              {tabActiva === 'todos' ? 'Aún no has hecho ningún pedido' : 'No tienes pedidos en este estado'}
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-4 px-6 py-3 rounded-xl text-white font-bold text-sm"
              style={{ backgroundColor: '#8B1A1A' }}
            >
              Hacer mi primer pedido
            </button>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const config = ESTADO_CONFIG[pedido.status] ?? ESTADO_CONFIG.pending
            const imagenes = pedido.order_items?.slice(0, 3) ?? []
            const extras = (pedido.order_items?.length ?? 0) - 3

            return (
              /* Modificado: Se agregó el sombreado shadow-md y bordes rounded-2xl */
              <div key={pedido.id} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100/50 flex flex-col gap-3">

                {/* Cabecera pedido */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-extrabold" style={{ color: '#2C1810' }}>
                      Pedido #{pedido.id}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatearFecha(pedido.created_at)}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ color: config.color, backgroundColor: config.bg }}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Imágenes productos */}
                <div className="flex items-center gap-2 my-1">
                  {imagenes.map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      {item.products?.image_url ? (
                        <img src={item.products.image_url} alt={item.products.name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                      )}
                    </div>
                  ))}
                  {extras > 0 && (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>+{extras}</span>
                    </div>
                  )}
                </div>

                {/* Pasos gráficos del pedido */}
                <PasosPedido estado={pedido.status} />

                {/* Mensaje de estado y total del pedido */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {MENSAJES[pedido.status] ?? ''}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400 font-medium">Total pagado</span>
                    <span className="text-sm font-black text-[#8B1A1A]">
                      ${Number(pedido.total).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>

      <NavInferior />
    </div>
  )
}
