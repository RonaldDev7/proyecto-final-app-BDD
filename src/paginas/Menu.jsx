import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexto/AuthContexto'
import NavInferior from '../componentes/NavInferior'

const CATEGORIAS = [
  { id: null, nombre: 'Todos', emoji: '⊞' },
  { id: 1, nombre: 'Platos Fuertes', emoji: '🍔' },
  { id: 2, nombre: 'Entradas',       emoji: '🍟' },
  { id: 3, nombre: 'Bebidas',        emoji: '🥤' },
  { id: 4, nombre: 'Postres',        emoji: '🍰' },
]

export default function Menu() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [searchParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState(
    searchParams.get('categoria') ? Number(searchParams.get('categoria')) : null
  )
  
  // 1. Cargamos platos de prueba directamente para que puedas diseñar sin errores de CORS
  const [productosPorCategoria, setProductosPorCategoria] = useState({
    "Platos Fuertes": [
      { id: 1, name: "Hamburguesa Especial", price: 25000, description: "Carne artesanal de la casa, queso cheddar, vegetales frescos y salsas.", image_url: "HamburguesaEspecial.png" },
      { id: 2, name: "Pizza Pepperoni madurada", price: 30000, description: "Masa delgada y crujiente, salsa napolitana, mozzarella y pepperoni.", image_url: "Pizza Pepperoni madurada.webp" }
    ],
    "Entradas": [
      { id: 3, name: "Papas Fritas Crujientes", price: 12000, description: "Porción de papas seleccionadas con sal marina y salsa de ajo.", image_url: "papas.webp" }
    ],
    "Bebidas": [
      { id: 4, name: "Limonada Natural Cerezada", price: 8000, description: "Refrescante jugo de limón natural endulzado con cerezas frescas.", image_url: "LimonadaCerezada.png" }
    ]
  })
  
  // Ponemos cargando en false por defecto para maquetar de inmediato
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      // Dejamos la petición lista. Al conectar la base de datos real, esto sobreescribirá los datos falsos automáticamente.
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('available', true)
      if (data && data.length > 0) {
        const agrupado = {}
        data.forEach((p) => {
          const cat = p.categories?.name ?? 'Otros'
          if (!agrupado[cat]) agrupado[cat] = []
          agrupado[cat].push(p)
        })
        setProductosPorCategoria(agrupado)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const agregarAlCarrito = async (productoId) => {
    if (!usuario) return
    const { data: existe } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', usuario.id)
      .eq('product_id', productoId)
      .single()

    if (existe) {
      await supabase
        .from('cart_items')
        .update({ quantity: existe.quantity + 1 })
        .eq('id', existe.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: usuario.id, product_id: productoId, quantity: 1 })
    }
  }

  const filtrarProductos = (productos) => {
    if (!busqueda) return productos
    return productos.filter((p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  const categoriasFiltradas = () => {
    if (categoriaActiva !== null) {
      const nombre = CATEGORIAS.find((c) => c.id === categoriaActiva)?.nombre
      const prods = productosPorCategoria[nombre] ?? []
      return { [nombre]: filtrarProductos(prods) }
    }
    const resultado = {}
    Object.entries(productosPorCategoria).forEach(([cat, prods]) => {
      const filtrados = filtrarProductos(prods)
      if (filtrados.length > 0) resultado[cat] = filtrados
    })
    return resultado
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#FAF6F1' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 bg-white shadow-sm">
        <button style={{ color: '#8B1A1A' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-extrabold" style={{ color: '#2C1810' }}>Menú</h1>
        <Link to="/carrito" className="relative">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2C1810" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: '#8B1A1A' }}>5</span>
        </Link>
      </div>

      {/* Buscador */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white border rounded-xl px-3 py-2.5"
            style={{ borderColor: '#E0D6CE' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar platos, bebidas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#2C1810' }}
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-2.5 bg-white border rounded-xl text-xs font-semibold"
            style={{ borderColor: '#E0D6CE', color: '#2C1810' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filtrar
          </button>
        </div>
      </div>

      {/* Tabs categorías */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIAS.map((cat) => {
          const activo = categoriaActiva === cat.id
          return (
            <button
              key={cat.id ?? 'todos'}
              onClick={() => setCategoriaActiva(cat.id)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                backgroundColor: activo ? '#8B1A1A' : 'white',
                color: activo ? 'white' : '#2C1810',
                borderColor: activo ? '#8B1A1A' : '#E0D6CE',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.nombre}</span>
            </button>
          )
        })}
      </div>

      {/* Banner */}
      <div className="mx-4 my-3 rounded-2xl overflow-hidden relative" style={{ backgroundColor: '#8B1A1A', minHeight: 110 }}>
        <div className="p-4 pr-28">
          <p className="text-white font-extrabold text-base leading-tight">
            <span style={{ color: '#F5A623' }}>20% OFF</span> en tu<br />primer pedido
          </p>
          <p className="text-white text-xs opacity-80 mb-2">¡Aprovecha ahora!</p>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#F5A623', color: '#2C1810' }}>
            Pedir ahora
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="absolute top-3 right-3 w-12 h-12 rounded-full flex flex-col items-center justify-center"
          style={{ backgroundColor: '#F5A623' }}>
          <span className="text-xs font-black" style={{ color: '#2C1810' }}>20%</span>
          <span className="text-[9px] font-bold" style={{ color: '#2C1810' }}>OFF</span>
        </div>
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80"
          alt=""
          className="absolute right-0 bottom-0 h-28 object-cover"
          style={{ borderRadius: '0 0 1rem 0' }}
        />
      </div>

      {/* 2. RENDERIZADO DE LAS TARJETAS CON EFECTO DE SOMBRA CASILLA */}
      <div className="px-4 flex flex-col gap-6 mt-4">
        {cargando ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: '#8B1A1A', borderTopColor: 'transparent' }} />
          </div>
        ) : Object.keys(categoriasFiltradas()).length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No se encontraron productos</p>
          </div>
        ) : (
          Object.entries(categoriasFiltradas()).map(([categoria, productos]) => (
            <div key={categoria} className="flex flex-col gap-3">
              {/* Título de la sección de comida */}
              <h2 className="text-base font-extrabold text-gray-800 px-1">{categoria}</h2>
              
              {/* Contenedor de las casillas en lista */}
              <div className="flex flex-col gap-3.5">
                {productos.map((plato) => (
                  <div 
                    key={plato.id} 
                    className="bg-white p-3.5 rounded-2xl shadow-md border border-gray-100 flex gap-4 transition-all active:scale-[0.99] hover:shadow-lg"
                  >
                    {/* Imagen del plato */}
                    <img 
                      src={plato.image_url} 
                      alt={plato.name} 
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-100" 
                    />

                    {/* Contenido de texto y precio */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{plato.name}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{plato.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-sm text-[#8B1A1A]">
                          ${plato.price.toLocaleString('es-CO')}
                        </span>
                        <button 
                          onClick={() => agregarAlCarrito(plato.id)}
                          className="bg-[#8B1A1A] hover:bg-[#6E1414] text-white text-[11px] px-3.5 py-1.5 rounded-xl font-bold transition-colors shadow-sm"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Barra inferior */}
      <NavInferior />
    </div>
  )
}
