import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [producto, setProducto] = useState(null)
  const [extras, setExtras] = useState([])
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([])
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [agregando, setAgregando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data: prod } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single()

      const { data: exts } = await supabase
        .from('product_extras')
        .select('*')
        .eq('product_id', id)

      setProducto(prod)
      setExtras(exts ?? [])
      setCargando(false)
    }
    cargar()
  }, [id])

  const toggleExtra = (extraId) => {
    setExtrasSeleccionados((prev) =>
      prev.includes(extraId)
        ? prev.filter((e) => e !== extraId)
        : [...prev, extraId]
    )
  }

  const calcularTotal = () => {
    if (!producto) return 0
    const precioExtras = extras
      .filter((e) => extrasSeleccionados.includes(e.id))
      .reduce((acc, e) => acc + Number(e.extra_price), 0)
    return (Number(producto.price) + precioExtras) * cantidad
  }

  const agregarAlCarrito = async () => {
    if (!usuario) return
    setAgregando(true)

    const { data: existe } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('product_id', producto.id)
      .single()

    if (existe) {
      await supabase
        .from('cart_items')
        .update({ quantity: existe.quantity + cantidad })
        .eq('id', existe.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: usuario.id, product_id: producto.id, quantity: cantidad })
    }

    setAgregando(false)
    navigate('/carrito')
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6F1' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6F1' }}>
        <p style={{ color: '#9CA3AF' }}>Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Imagen hero */}
      <div className="relative w-full h-64 bg-gray-200">
        {producto.image_url ? (
          <img src={producto.image_url} alt={producto.name}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
        )}

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Botón favorito */}
        <button className="absolute top-5 right-14 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B1A1A" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Botón compartir */}
        <button className="absolute top-5 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>

        {/* Puntos indicador */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-5 pt-5 pb-32">

        {/* Nombre y precio */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-xl font-extrabold flex-1 pr-4" style={{ color: '#2C1810' }}>
            {producto.name}
          </h1>
          <span className="text-xl font-extrabold" style={{ color: '#8B1A1A' }}>
            ${Number(producto.price).toLocaleString('es-CO')}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <svg width="14" height="14" fill="#F5A623" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-xs font-bold" style={{ color: '#2C1810' }}>4.8</span>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>(256 opiniones)</span>
        </div>

        {/* Descripción */}
        <p className="text-sm mb-5 leading-relaxed" style={{ color: '#7A6A60' }}>
          {producto.description}
        </p>

        {/* Extras */}
        {extras.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-extrabold mb-3" style={{ color: '#2C1810' }}>
              Elige los complementos
            </h2>
            <div className="flex flex-col gap-2">
              {extras.map((extra) => {
                const seleccionado = extrasSeleccionados.includes(extra.id)
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                    style={{
                      borderColor: seleccionado ? '#8B1A1A' : '#E0D6CE',
                      backgroundColor: 'white',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                      🥓
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold" style={{ color: '#2C1810' }}>{extra.name}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        +${Number(extra.extra_price).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center border"
                      style={{
                        backgroundColor: seleccionado ? '#8B1A1A' : 'white',
                        borderColor: seleccionado ? '#8B1A1A' : '#E0D6CE',
                      }}
                    >
                      {seleccionado && (
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Cantidad */}
        <div className="mb-4">
          <h2 className="text-sm font-extrabold mb-3" style={{ color: '#2C1810' }}>Cantidad</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              className="w-9 h-9 rounded-full border flex items-center justify-center font-bold"
              style={{ borderColor: '#E0D6CE', color: '#2C1810' }}
            >
              −
            </button>
            <span className="text-lg font-extrabold" style={{ color: '#2C1810' }}>{cantidad}</span>
            <button
              onClick={() => setCantidad((c) => c + 1)}
              className="w-9 h-9 rounded-full border flex items-center justify-center font-bold"
              style={{ borderColor: '#E0D6CE', color: '#2C1810' }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t px-5 py-4"
        style={{ borderColor: '#E0D6CE' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: '#7A6A60' }}>Total</span>
          <span className="text-xl font-extrabold" style={{ color: '#8B1A1A' }}>
            ${calcularTotal().toLocaleString('es-CO')}
          </span>
        </div>
        <button
          onClick={agregarAlCarrito}
          disabled={agregando}
          className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2"
          style={{ backgroundColor: '#8B1A1A', opacity: agregando ? 0.7 : 1 }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {agregando ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </div>

    </div>
  )
}