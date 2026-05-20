import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'
import NavInferior from '../componentes/NavInferior'

const ENVIO = 5900
const META_ENVIO_GRATIS = 50000

export default function Carrito() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  
  // 1. Inyectamos ítems locales de prueba con tus imágenes de la carpeta public
  const [items, setItems] = useState([
    {
      id: "item_1",
      product_id: 1,
      quantity: 1,
      products: {
        id: 1,
        name: "Hamburguesa Especial",
        description: "Carne artesanal de la casa con queso cheddar.",
        price: 25000,
        image_url: "/HamburguesaEspecial.png"
      }
    },
    {
      id: "item_2",
      product_id: 4,
      quantity: 2,
      products: {
        id: 4,
        name: "Limonada Natural Cerezada",
        description: "Refrescante jugo de limón natural endulzado con cerezas.",
        price: 8000,
        image_url: "/LimonadaCerezada.png"
      }
    }
  ])
  
  const [sugeridos, setSugeridos] = useState([])
  
  // Desactivamos el spinner inicial para maquetar de inmediato
  const [cargando, setCargando] = useState(false)
  const [finalizando, setFinalizando] = useState(false)

  useEffect(() => {
    cargarCarrito()
    cargarSugeridos()
  }, [])

  const cargarCarrito = async () => {
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(id, name, description, price, image_url)')
      .eq('user_id', usuario?.id)
    if (data && data.length > 0) {
      setItems(data)
    }
    setCargando(false)
  }

  const cargarSugeridos = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .limit(5)
    if (data && data.length > 0) {
      setSugeridos(data)
    }
  }

  const actualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarItem(itemId)
      return
    }
    // Modificación local instantánea para probar botones + y -
    setItems((prev) =>
      prev.map((i) => i.id === itemId ? { ...i, quantity: nuevaCantidad } : i)
    )
  }

  const eliminarItem = async (itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const vaciarCarrito = async () => {
    setItems([])
  }

  const agregarSugerido = (producto) => {
    const existe = items.find((i) => i.product_id === producto.id)
    if (existe) {
      actualizarCantidad(existe.id, existe.quantity + 1)
    } else {
      setItems((prev) => [...prev, {
        id: `item_${Date.now()}`,
        product_id: producto.id,
        quantity: 1,
        products: producto
      }])
    }
  }

  const subtotal = items.reduce(
    (acc, i) => acc + Number(i.products?.price ?? 0) * i.quantity, 0
  )
  const faltaParaGratis = Math.max(0, META_ENVIO_GRATIS - subtotal)
  const envio = subtotal >= META_ENVIO_GRATIS ? 0 : ENVIO
  const total = subtotal + envio
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  const finalizarPedido = async () => {
    if (items.length === 0) return
    setFinalizando(true)
    navigate('/pedidos')
    setFinalizando(false)
  }

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
      <div className="flex items-center justify-between px-5 pt-6 pb-4 bg-white shadow-sm">
        <button onClick={() => navigate(-1)}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-extrabold" style={{ color: '#2C1810' }}>Mi Carrito</h1>
        <button onClick={vaciarCarrito}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>Tu carrito está vacío</p>
          <p className="text-sm text-center mb-6" style={{ color: '#9CA3AF' }}>
            Agrega productos del menú para comenzar tu pedido
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 rounded-xl text-white font-bold"
            style={{ backgroundColor: '#8B1A1A' }}
          >
            Ver menú
          </button>
        </div>
      ) : (
        <>
          {/* Barra envío gratis (Sombreada con casilla flotante) */}
          <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-md border border-gray-100/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛵</span>
              <p className="text-xs font-semibold" style={{ color: '#2C1810' }}>
                {faltaParaGratis > 0
                  ? `Falta $${faltaParaGratis.toLocaleString('es-CO')} para envío gratis`
                  : '¡Tienes envío gratis!'}
              </p>
              <span className="ml-auto text-xs font-bold" style={{ color: '#9CA3AF' }}>
                ${META_ENVIO_GRATIS.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#F0EAE4' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: '#8B1A1A',
                  width: `${Math.min(100, (subtotal / META_ENVIO_GRATIS) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Items del carrito (Casillas independientes con sombra) */}
          <div className="mx-4 mt-4 flex flex-col gap-3.5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white rounded-2xl p-3.5 shadow-md border border-gray-100/60 transition-all hover:shadow-lg">
                <img
                  src={item.products?.image_url}
                  alt={item.products?.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-50"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-gray-800 truncate pr-2">
                        {item.products?.name}
                      </p>
                      <button onClick={() => eliminarItem(item.id)}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.products?.description}</p>
                  </div>
                  
                  {/* Selector de cantidad y precio */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-[#8B1A1A]">
                      ${(Number(item.products?.price ?? 0) * item.quantity).toLocaleString('es-CO')}
                    </span>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2.5 py-1 border border-gray-200/50">
                      <button 
                        onClick={() => actualizarCantidad(item.id, item.quantity - 1)}
                        className="text-gray-500 font-bold text-sm px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => actualizarCantidad(item.id, item.quantity + 1)}
                        className="text-gray-500 font-bold text-sm px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de totales (Casilla flotante con sombra) */}
          <div className="mx-4 mt-5 bg-white rounded-2xl p-4 shadow-md border border-gray-100/50 flex flex-col gap-2.5">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>Subtotal ({totalItems} productos)</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>Costo de envío</span>
              <span>{envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-CO')}`}</span>
            </div>
            <div className="h-px bg-gray-100 my-1" />
            <div className="flex justify-between text-sm font-black text-gray-800">
              <span>Total a pagar</span>
              <span className="text-[#8B1A1A]">${total.toLocaleString('es-CO')}</span>
            </div>
            
            <button
              onClick={finalizarPedido}
              disabled={finalizando}
              className="w-full py-3.5 bg-[#8B1A1A] hover:bg-[#6E1414] text-white font-bold text-sm rounded-xl mt-2 transition-colors shadow-sm"
            >
              {finalizando ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </>
      )}

      <NavInferior />
    </div>
  )
}
