import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  const incrementItem = (id) => {
    setCartItems((prev) => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  }

  const decrementItem = (id) => {
    setCartItems((prev) => {
      const existing = prev.find(i => i.id === id)
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      } else {
        return prev.filter(i => i.id !== id)
      }
    })
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setCartItems([])

  const addToFavorites = (item) => {
    setFavorites((prev) => {
      if (prev.find((fav) => fav.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, incrementItem, decrementItem, removeItem, clearCart, favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartContext
