// src/api.js
// Use relative URL for production (Vercel), absolute for local development
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:4000/api'

// Helper to get auth token
function getAuthToken() {
  const user = localStorage.getItem('currentUser')
  if (user) {
    try {
      return JSON.parse(user).token
    } catch {
      return null
    }
  }
  return null
}

// Helper for authenticated requests
function authHeaders() {
  const token = getAuthToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Products API
export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`)
  if (!res.ok) throw new Error('Failed to load products')
  const products = await res.json()
  // Normalize products to have consistent id field
  return products.map(p => ({
    ...p,
    id: p._id || p.id  // Ensure id is always set from _id
  }))
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error('Product not found')
  const product = await res.json()
  // Normalize product to have consistent id field
  return {
    ...product,
    id: product._id || product.id
  }
}

// User API
export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Signup failed')
  return data
}

export async function signupSeller(name, email, password, shopName) {
  const res = await fetch(`${API_BASE}/users/signup/seller`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, shopName })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Signup failed')
  return data
}

export async function login(email, password, role) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data
}

// Seller API
export async function fetchSellerProducts() {
  const res = await fetch(`${API_BASE}/seller/products`, {
    headers: authHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function addSellerProduct(product) {
  const res = await fetch(`${API_BASE}/seller/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(product)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to add product')
  return data
}

export async function updateSellerProduct(id, updates) {
  const res = await fetch(`${API_BASE}/seller/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(updates)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update product')
  return data
}

export async function deleteSellerProduct(id) {
  const res = await fetch(`${API_BASE}/seller/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete product')
  return data
}

export async function fetchSellerStats() {
  const res = await fetch(`${API_BASE}/seller/stats`, {
    headers: authHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

// Orders API
export async function placeOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(order)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Order failed')
  return data
}

export async function fetchMyOrders() {
  const res = await fetch(`${API_BASE}/orders/my-orders`, {
    headers: authHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}