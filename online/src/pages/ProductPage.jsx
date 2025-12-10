import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchProductById } from '../api'

function isLoggedIn() {
  return !!localStorage.getItem('currentUser')
}

export default function ProductPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProductById(id)
      .then(data => setProduct(data))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!isLoggedIn()) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }
    addToCart(product, 1)
  }

  if (loading) return <div className="center card">Loading…</div>
  if (error) return <div className="center card">Error: {error}</div>
  if (!product) return <div className="center card">Product not found</div>

  return (
    <div className="product-page">
      <div className="card">
        <img src={product.image} alt={product.name} style={{width:'100%',borderRadius:10}} />
        <h2 style={{marginTop:12}}>{product.name}</h2>
        <p className="muted">{product.description}</p>
      </div>

      <aside className="card">
        <div style={{fontSize:18,fontWeight:700}}>₹{product.price}</div>
        <div className="muted" style={{margin:'8px 0'}}>Delivery in 30-45 mins</div>
        <button className="btn" onClick={handleAddToCart}>Add to cart</button>
      </aside>
    </div>
  )
}
