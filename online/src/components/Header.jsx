import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function getStoredUser() {
  try {
    const currentUser = localStorage.getItem('currentUser')
    return currentUser ? JSON.parse(currentUser) : null
  } catch {
    return null
  }
}

// Cart Icon Component
function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}

// Profile Icon Component
function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function Header(){
  const { cart } = useCart()
  const count = cart.reduce((s,i)=>s+i.qty,0)
  const [user] = useState(getStoredUser)

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" style={{display:'flex', alignItems:'center', gap:12}}>
          <img src="/logo.png" alt="Online logo" style={{height:40, objectFit:'contain'}} />
          <span style={{fontWeight:700, color:'var(--accent)'}}>ZepClone</span>
        </Link>

        <nav className="header-actions">
          <Link to="/" className="link-muted">Home</Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            title="Cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--accent)',
              textDecoration: 'none'
            }}
          >
            <CartIcon />
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#dc3545',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {count}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          {user ? (
            <Link
              to="/profile"
              title={`Profile - ${user.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--accent)',
                textDecoration: 'none'
              }}
            >
              <ProfileIcon />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="link-muted">Login</Link>
              <Link to="/signup" className="btn">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}