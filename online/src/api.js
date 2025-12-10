// src/api.js
// Using fake API with mock data (no backend required)

import products from './data/products'

// Simulate network delay (300-600ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const randomDelay = () => delay(300 + Math.random() * 300)

export async function fetchProducts() {
  await randomDelay()
  return [...products]
}

export async function fetchProductById(id) {
  await randomDelay()
  const product = products.find(p => p.id === id)
  if (!product) throw new Error('Product not found')
  return { ...product }
}

export async function placeOrder(order) {
  await randomDelay()
  // Simulate order creation
  return {
    success: true,
    orderId: 'ORD-' + Date.now(),
    ...order
  }
}