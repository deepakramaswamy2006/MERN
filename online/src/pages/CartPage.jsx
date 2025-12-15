import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

export default function CartPage(){
  const { cart, updateQty, removeFromCart, total } = useCart()
  const nav = useNavigate()

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  if (cart.length === 0) return (
    <div className="center">
      <div className="card" style={{padding:30}}>
        <h3>Your cart is empty</h3>
        <Link to="/" className="btn" style={{marginTop:12}}>Go shopping</Link>
      </div>
    </div>
  )

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:18}}>
      <div>
        <h3>Cart items ({cart.length} {cart.length === 1 ? 'product' : 'products'})</h3>
        <div className="cart-list">
          {cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={(id, qty)=>updateQty(id, qty)}
              onRemove={(id)=>removeFromCart(id)}
            />
          ))}
        </div>
      </div>

      <aside className="card" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
        <h4>Order Summary</h4>
        <div style={{ borderBottom: '1px solid #eee', paddingBottom: 12, marginBottom: 12 }}>
          {cart.map(item => (
            <div key={item.id} className="row" style={{justifyContent:'space-between', marginBottom: 8, fontSize: 14}}>
              <div className="muted">{item.name} × {item.qty}</div>
              <div>₹{item.price * item.qty}</div>
            </div>
          ))}
        </div>
        <div className="row" style={{justifyContent:'space-between', marginBottom: 8}}>
          <div className="muted">Total Items</div>
          <div>{totalItems}</div>
        </div>
        <div className="row" style={{justifyContent:'space-between', marginBottom: 16}}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Total Amount</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>₹{total}</div>
        </div>
        <button className="btn" style={{ width: '100%', padding: 12 }} onClick={()=>nav('/checkout')}>
          Proceed to Checkout
        </button>
      </aside>
    </div>
  )
}