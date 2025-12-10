// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart_v1')
      return raw ? JSON.parse(raw) : []
    } catch (err) {
      console.error('Failed to read cart from localStorage', err)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart_v1', JSON.stringify(cart))
    } catch (err) {
      console.error('Failed to save cart to localStorage', err)
    }
  }, [cart])

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id)
      if (found) {
        return prev.map(p => (p.id === product.id ? { ...p, qty: p.qty + qty } : p))
      }
      return [...prev, { ...product, qty }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p.id !== id))
  }

  function updateQty(id, qty) {
    if (qty <= 0) return removeFromCart(id)
    setCart(prev => prev.map(p => (p.id === id ? { ...p, qty } : p)))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}