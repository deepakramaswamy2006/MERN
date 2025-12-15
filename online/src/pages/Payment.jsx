import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { placeOrder } from '../api'

export default function Payment() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const checkoutData = location.state || {}

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  function formatExpiry(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid card number')
        return
      }
      if (!cardName.trim()) {
        setError('Please enter the name on card')
        return
      }
      if (expiry.length < 5) {
        setError('Please enter a valid expiry date')
        return
      }
      if (cvv.length < 3) {
        setError('Please enter a valid CVV')
        return
      }
    }

    setProcessing(true)

    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        total: total,
        shippingAddress: {
          name: checkoutData.name || '',
          email: checkoutData.email || '',
          phone: checkoutData.phone || '',
          address: checkoutData.address || ''
        },
        paymentMethod: paymentMethod
      }

      // Save order to database
      const result = await placeOrder(orderData)

      clearCart()
      navigate('/order-success', {
        state: {
          orderTotal: total,
          orderId: result.orderId,
          customerName: checkoutData.name || 'Customer'
        }
      })
    } catch (err) {
      console.error('Order failed:', err)
      setError(err.message || 'Failed to place order. Please try again.')
      setProcessing(false)
    }
  }

  if (cart.length === 0 && !processing) {
    return <div className="center card" style={{padding: 30}}>No items to pay for</div>
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 20 }}>Payment</h2>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="muted">Order Total:</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>₹{total}</span>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <label style={{ flex: 1, cursor: 'pointer' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={e => setPaymentMethod(e.target.value)}
            />{' '}
            Credit/Debit Card
          </label>
          <label style={{ flex: 1, cursor: 'pointer' }}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={e => setPaymentMethod(e.target.value)}
            />{' '}
            Cash on Delivery
          </label>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {paymentMethod === 'card' && (
            <>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>Card Number</span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>Name on Card</span>
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value.toUpperCase())}
                  placeholder="JOHN DOE"
                  style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                />
              </label>

              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>Expiry</span>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                  />
                </label>
                <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>CVV</span>
                  <input
                    type="password"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    maxLength={4}
                    style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
                  />
                </label>
              </div>
            </>
          )}

          {paymentMethod === 'cod' && (
            <div style={{ padding: 20, background: '#f9f9f9', borderRadius: 8, textAlign: 'center' }}>
              <p className="muted">Pay with cash when your order is delivered</p>
            </div>
          )}

          <button
            type="submit"
            className="btn"
            disabled={processing}
            style={{ padding: 14, fontSize: 16, marginTop: 8 }}
          >
            {processing ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  )
}

