import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccess() {
  const location = useLocation()
  const { orderTotal, customerName } = location.state || {}

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: 40 }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
        <h2 style={{ color: 'var(--accent)', marginBottom: 12 }}>Order Placed Successfully!</h2>
        <p className="muted" style={{ fontSize: 16, marginBottom: 20 }}>
          Thank you{customerName ? `, ${customerName}` : ''}! Your order has been confirmed.
        </p>
        {orderTotal && (
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
            Order Total: ₹{orderTotal}
          </p>
        )}
        <p className="muted" style={{ marginBottom: 30 }}>
          You will receive an email confirmation shortly with your order details.
        </p>
        <Link to="/" className="btn" style={{ padding: '12px 24px', fontSize: 16 }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

