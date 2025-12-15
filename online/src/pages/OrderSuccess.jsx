import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccess() {
  const location = useLocation()
  const { orderTotal, orderId, customerName } = location.state || {}

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <h2 style={{ color: 'var(--accent)', marginBottom: 12 }}>Order Placed Successfully!</h2>
        <p className="muted" style={{ fontSize: 16, marginBottom: 20 }}>
          Thank you{customerName ? `, ${customerName}` : ''}! Your order has been confirmed.
        </p>
        {orderId && (
          <div style={{
            background: '#f5f5f5',
            padding: '12px 20px',
            borderRadius: 8,
            marginBottom: 16,
            display: 'inline-block'
          }}>
            <span className="muted">Order ID: </span>
            <span style={{ fontWeight: 600 }}>#{orderId.slice(-8).toUpperCase()}</span>
          </div>
        )}
        {orderTotal && (
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
            Order Total: ₹{orderTotal}
          </p>
        )}
        <p className="muted" style={{ marginBottom: 30 }}>
          You can view your order history in your profile.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/profile" className="btn" style={{ padding: '12px 24px', fontSize: 16, background: '#28a745' }}>
            View Orders
          </Link>
          <Link to="/" className="btn" style={{ padding: '12px 24px', fontSize: 16 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

