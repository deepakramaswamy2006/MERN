import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

export default function CartPage(){
  const { cart, updateQty, removeFromCart, total } = useCart()
  const nav = useNavigate()

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
        <h3>Cart items</h3>
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

      <aside className="card">
        <h4>Summary</h4>
        <div className="row" style={{justifyContent:'space-between', margin:'12px 0'}}>
          <div className="muted">Subtotal</div>
          <div>₹{total}</div>
        </div>
        <button className="btn" onClick={()=>nav('/checkout')}>Proceed to checkout</button>
      </aside>
    </div>
  )
}