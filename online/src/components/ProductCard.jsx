import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function isLoggedIn() {
  return !!localStorage.getItem('currentUser')
}

export default function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  function handleAdd() {
    if (!isLoggedIn()) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }
    onAdd(product)
  }

  function handleBuyNow() {
    if (!isLoggedIn()) {
      alert('Please login to buy items')
      navigate('/login')
      return
    }
    // Add to cart and go to checkout
    addToCart(product, 1)
    navigate('/checkout')
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/product/${product.id}`} style={{textDecoration:'none', color:'inherit'}}>
        <img className="product-img" src={product.image} alt={product.name}
             onError={e => e.target.src = 'https://via.placeholder.com/150'} />
        <div className="product-title">{product.name}</div>
      </Link>
      <div style={{ marginTop: 8 }}>
        <div className="product-price">₹{product.price}</div>
        <div className="muted" style={{fontSize:13, marginBottom: 8}}>{product.description}</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button className="btn" onClick={handleAdd} style={{ flex: 1 }}>Add</button>
        <button
          onClick={handleBuyNow}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#28a745',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}