import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'
import NavInferior from '../componentes/NavInferior'
import { useCarrito } from '../contexto/CarritoContexto'

const categorias = [
  { id: 1, nombre: 'Platos Fuertes', emoji: '🍔' },
  { id: 2, nombre: 'Entradas',       emoji: '🍟' },
  { id: 3, nombre: 'Bebidas',        emoji: '🥤' },
  { id: 4, nombre: 'Postres',        emoji: '🍰' },
]

export default function Inicio() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Lista local enlazada con tus archivos reales de la carpeta public
  const [productos, setProductos] = useState([])
  
  const { agregarAlCarrito } = useCarrito()

  const [cargando, setCargando] = useState(true)

  useEffect(() => {
  const cargarProductos = async () => {
    // setCargando ya está en true desde el useState inicial

    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, description, image_url')
      .eq('available', true)
      .order('name')
      .limit(6)

    if (error) {
      console.error('Error cargando productos:', error)
    } else {
      setProductos(data ?? [])
    }

    setCargando(false)
  }

  cargarProductos()
}, [])

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <img src="/logo.png" alt="Sabor del Chef" className="w-20 h-20 object-contain" />
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
        </svg>
      </div>

      {/* Banner promocional */}
      <div className="mx-4 rounded-2xl overflow-hidden relative mb-5" style={{ backgroundColor: '#8B1A1A', minHeight: 140 }}>
        <div className="p-5 pr-32">
          <p className="text-white text-lg font-extrabold leading-tight">
            ¡La mejor comida,<br />
            <span style={{ color: '#F5A623' }}>en tu puerta!</span>
          </p>
          <p className="text-white text-xs mt-1 mb-3 opacity-80">
            Disfruta nuestros platos donde estés
          </p>
          <Link to="/menu">
            <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: '#F5A623', color: '#2C1810' }}>
              Pedir ahora
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full flex flex-col items-center justify-center"
          style={{ backgroundColor: '#F5A623' }}>
          <span className="text-xs font-black" style={{ color: '#2C1810' }}>20%</span>
          <span className="text-[10px] font-bold" style={{ color: '#2C1810' }}>OFF</span>
        </div>
        <img
          src="/hamburguesa.png"
          alt="Hamburguesa"
          className="absolute right-0 bottom-0 h-32 object-contain"
          style={{ borderRadius: '0 0 1rem 0' }}
        />
      </div>

      {/* Categorías */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold" style={{ color: '#2C1810' }}>Explora nuestro menú</h2>
          <Link to="/menu" className="text-xs font-semibold" style={{ color: '#8B1A1A' }}>Ver todo</Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {categorias.map((cat) => (
            <Link key={cat.id} to={`/menu?categoria=${cat.id}`}>
              <div className="flex flex-col items-center gap-1 bg-white rounded-2xl py-3 shadow-md border border-gray-100/50">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-[10px] font-bold text-center leading-tight" style={{ color: '#2C1810' }}>
                  {cat.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TARJETA DE RESERVA DE MESAS (Añadida aquí de forma fija y limpia) */}
      <div className="mx-4 mb-6 bg-white rounded-2xl p-4 shadow-md border border-gray-100/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📅</span>
          <div>
            <h3 className="text-sm font-bold text-gray-800">¿Quieres comer aquí?</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Asegura tu mesa en segundos sin costo.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/reservas')}
          className="bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
        >
          Reservar
        </button>
      </div>

      {/* Recomendados */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold" style={{ color: '#2C1810' }}>Recomendados para ti</h2>
        </div>

        {cargando ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 pb-4">
            {productos.map((producto) => (
              <div 
                key={producto.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col transition-all active:scale-[0.98] hover:shadow-xl"
              >
                <div
                  className="w-full h-28 bg-gray-50 cursor-pointer flex items-center justify-center p-2 overflow-hidden"
                  onClick={() => navigate(`/producto/${producto.id}`)}
                >
                  {producto.image_url ? (
                    <img 
                      src={producto.image_url} 
                      alt={producto.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="text-3xl">🍽️</div>
                  )}
                </div>
                
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800 truncate">{producto.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 mb-2">{producto.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-[#8B1A1A]">
                      ${Number(producto.price).toLocaleString('es-CO')}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(producto.id)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#8B1A1A' }}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {productos.length === 0 && (
              <div className="w-full text-center col-span-2 py-8">
                <p className="text-sm text-gray-400">No hay productos disponibles</p>
              </div>
            )}
          </div>
        )}
      </div>

      <NavInferior />
    </div>
  )
}
