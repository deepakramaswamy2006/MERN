import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function isLoggedIn() {
  return !!localStorage.getItem('currentUser')
}

export default function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()

  function handleAdd() {
    if (!isLoggedIn()) {
      alert('Please login to add items to cart')
      navigate('/login')
      return
    }
    onAdd(product)
  }

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} style={{textDecoration:'none', color:'inherit'}}>
        <img className="product-img" src={product.image} alt={product.name} />
        <div className="product-title">{product.name}</div>
      </Link>
      <div className="row" style={{justifyContent:'space-between', marginTop:8}}>
        <div>
          <div className="product-price">₹{product.price}</div>
          <div className="muted" style={{fontSize:13}}>{product.description}</div>
        </div>
        <div>
          <button className="btn" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  )
}