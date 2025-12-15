import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../api'

export default function Home(){
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchProducts()
      .then(data => {
        if (mounted) setProducts(data)
      })
      .catch(err => {
        console.error(err)
        if (mounted) setError(err.message || 'Failed to load')
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="center card">Loading products…</div>
  if (error) return <div className="center card">Error: {error}</div>

  return (
    <div>
      <h2 className="center">Groceries near you</h2>
      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id || p._id} product={p} onAdd={(prod)=>addToCart(prod,1)} />
        ))}
      </div>
    </div>
  )
}
