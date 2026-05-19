import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavInferior from '../componentes/NavInferior'

export default function Reservas() {
  const navigate = useNavigate()
  
  // Estados para capturar los datos del formulario
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [personas, setPersonas] = useState(2)
  const [zona, setZona] = useState('Salón Principal')
  const [nota, setNota] = useState('')
  const [reservadoExito, setReservadoExito] = useState(false)

  const manejarReserva = (e) => {
    e.preventDefault()
    // Simulamos el éxito de la reserva local de inmediato
    setReservadoExito(true)
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
        <h1 className="text-lg font-extrabold" style={{ color: '#2C1810' }}>Reservar Mesa</h1>
        <div className="w-6" /> {/* Espaciador visual */}
      </div>

      <div className="px-4 mt-4">
        {reservadoExito ? (
          /* PANTALLA DE ÉXITO (Casilla flotante) */
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center gap-3 mt-10">
            <div className="text-5xl animate-bounce">🎉</div>
            <h2 className="text-lg font-black text-gray-800">¡Reserva Solicitada!</h2>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Tu mesa para <strong>{personas} personas</strong> en el <strong>{zona}</strong> ha sido agendada para el día <strong>{fecha}</strong> a las <strong>{hora}</strong>.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-2 w-full py-3 bg-[#8B1A1A] text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          /* FORMULARIO DE RESERVA */
          <form onSubmit={manejarReserva} className="flex flex-col gap-4">
            
            {/* Tarjeta 1: Fecha y Hora */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100/60 flex flex-col gap-3">
              <h2 className="text-xs font-black tracking-wider text-gray-400 uppercase">¿Cuándo nos visitas?</h2>
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500">Selecciona la Fecha</label>
                <input 
                  type="date" 
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500">Selecciona la Hora</label>
                <input 
                  type="time" 
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Tarjeta 2: Número de Comensales */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100/60 flex flex-col gap-3">
              <h2 className="text-xs font-black tracking-wider text-gray-400 uppercase">¿Cuántas personas vienen?</h2>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2 border border-gray-200/50">
                <span className="text-xs font-bold text-gray-600">Comensales</span>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setPersonas(p => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-gray-800 w-4 text-center">{personas}</span>
                  <button 
                    type="button"
                    onClick={() => setPersonas(p => p + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: Zona del restaurante */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100/60 flex flex-col gap-3">
              <h2 className="text-xs font-black tracking-wider text-gray-400 uppercase">Ambiente preferido</h2>
              <div className="grid grid-cols-3 gap-2">
                {['Salón Principal', 'Terraza', 'Zona VIP'].map((z) => {
                  const activo = zona === z
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZona(z)}
                      className="py-3 rounded-xl border text-[10px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1"
                      style={{
                        backgroundColor: activo ? '#8B1A1A' : '#F9F9F9',
                        color: activo ? 'white' : '#2C1810',
                        borderColor: activo ? '#8B1A1A' : '#E0D6CE',
                      }}
                    >
                      <span>{z === 'Salón Principal' ? '🪑' : z === 'Terraza' ? '🌿' : '✨'}</span>
                      <span>{z}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tarjeta 4: Notas adicionales */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100/60 flex flex-col gap-2">
              <h2 className="text-xs font-black tracking-wider text-gray-400 uppercase">Notas especiales</h2>
              <textarea 
                rows="2"
                placeholder="Ej. Mesa cerca a la ventana, celebración de cumpleaños, silla para bebé..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200/60 rounded-xl p-3 text-xs font-semibold outline-none text-gray-700 resize-none"
              />
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              className="w-full py-4 bg-[#8B1A1A] hover:bg-[#6E1414] text-white font-bold text-sm rounded-2xl mt-2 transition-colors shadow-md"
            >
              Confirmar mi Reserva
            </button>

          </form>
        )}
      </div>

      <NavInferior />
    </div>
  )
}
