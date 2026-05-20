import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContexto'

const CarritoContexto = createContext()

export function CarritoProvider({ children }) {
    const { user } = useAuth()  // ✅ corregido: era "usuario"

    const [itemsCarrito, setItemsCarrito] = useState([])
    const [cantidadCarrito, setCantidadCarrito] = useState(0)

    const cargarCarrito = async () => {
        if (!user) {
            setItemsCarrito([])
            setCantidadCarrito(0)
            return
        }

        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                products (
                    id,
                    name,
                    price,
                    image_url,
                    description
                )
            `)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error cargando carrito:', error)
            return
        }

        setItemsCarrito(data || [])
        const totalCantidad = data?.reduce((acc, item) => acc + item.quantity, 0) || 0
        setCantidadCarrito(totalCantidad)
    }

    const agregarAlCarrito = async (productoId, cantidad = 1) => {
        if (!user) return

        const { data: existe } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', productoId)
            .single()

        if (existe) {
            await supabase
                .from('cart_items')
                .update({ quantity: existe.quantity + cantidad })
                .eq('id', existe.id)
        } else {
            await supabase
                .from('cart_items')
                .insert({
                    user_id: user.id,
                    product_id: productoId,
                    quantity: cantidad,
                })
        }

        await cargarCarrito()
    }

    const actualizarCantidad = async (itemId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            await eliminarDelCarrito(itemId)
            return
        }

        await supabase
            .from('cart_items')
            .update({ quantity: nuevaCantidad })
            .eq('id', itemId)

        await cargarCarrito()
    }

    const eliminarDelCarrito = async (itemId) => {
        await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)

        await cargarCarrito()
    }

    const vaciarCarrito = async () => {
        if (!user) return

        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)

        setItemsCarrito([])
        setCantidadCarrito(0)
    }

    useEffect(() => {
        cargarCarrito()
    }, [user])

    return (
        <CarritoContexto.Provider
            value={{
                itemsCarrito,
                cantidadCarrito,
                agregarAlCarrito,
                actualizarCantidad,
                eliminarDelCarrito,
                vaciarCarrito,
                cargarCarrito,
            }}
        >
            {children}
        </CarritoContexto.Provider>
    )
}

export function useCarrito() {
    return useContext(CarritoContexto)
}