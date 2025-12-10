import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { cart, total } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const nav = useNavigate()

  function proceedToPayment(e) {
    e.preventDefault()
    // Pass checkout data to payment page
    nav('/payment', {
      state: {
        name,
        email,
        phone,
        address
      }
    })
  }

  if (cart.length === 0) return <div className="center card" style={{padding: 30}}>No items to checkout</div>

  return (
    <div style={{maxWidth:720, margin:'0 auto'}}>
      <h3>Checkout</h3>
      <form className="card" onSubmit={proceedToPayment} style={{display:'grid', gap:16, padding: 24}}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Full Name</span>
          <input
            required
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Your full name"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Phone Number</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            placeholder="Your phone number"
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Delivery Address</span>
          <textarea
            required
            value={address}
            onChange={e=>setAddress(e.target.value)}
            placeholder="House number, street, city, pincode"
            rows={3}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, resize: 'vertical' }}
          />
        </label>
        <div className="row" style={{justifyContent:'space-between', marginTop: 8}}>
          <div style={{ fontSize: 18 }}>
            <span className="muted">Total: </span>
            <span style={{ fontWeight: 700 }}>₹{total}</span>
          </div>
          <button className="btn" type="submit" style={{ padding: '12px 24px', fontSize: 16 }}>
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  )
}