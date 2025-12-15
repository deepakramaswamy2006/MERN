// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

// Get user-specific cart key
function getCartKey() {
  try {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const parsed = JSON.parse(user)
      return `cart_${parsed.id || parsed.email}`
    }
  } catch (err) {
    console.error('Error getting cart key', err)
  }
  return 'cart_guest'
}

export function CartProvider({ children }) {
  const [cartKey, setCartKey] = useState(getCartKey)

  const [cart, setCart] = useState(() => {
    try {
      const key = getCartKey()
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : []
    } catch (err) {
      console.error('Failed to read cart from localStorage', err)
      return []
    }
  })

  // Listen for user changes (login/logout)
  useEffect(() => {
    const newKey = getCartKey()
    if (newKey !== cartKey) {
      setCartKey(newKey)
      // Load cart for new user
      try {
        const raw = localStorage.getItem(newKey)
        setCart(raw ? JSON.parse(raw) : [])
      } catch (err) {
        setCart([])
      }
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart))
    } catch (err) {
      console.error('Failed to save cart to localStorage', err)
    }
  }, [cart, cartKey])

  function addToCart(product, qty = 1) {
    // Ensure we have a consistent id
    const productId = product.id || product._id
    if (!productId) {
      console.error('Product has no id:', product)
      return
    }

    setCart(prev => {
      const found = prev.find(p => p.id === productId)
      if (found) {
        return prev.map(p => (p.id === productId ? { ...p, qty: p.qty + qty } : p))
      }
      // Store with consistent id
      return [...prev, { ...product, id: productId, qty }]
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