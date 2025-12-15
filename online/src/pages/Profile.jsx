import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyOrders } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      navigate('/login')
    }
  }, [navigate])

  // Fetch user's order history (only for buyers, not sellers)
  useEffect(() => {
    if (user && user.role !== 'seller') {
      fetchMyOrders()
        .then(data => {
          setOrders(data)
          setLoadingOrders(false)
        })
        .catch(err => {
          console.error('Failed to load orders:', err)
          setOrdersError(err.message)
          setLoadingOrders(false)
        })
    } else if (user && user.role === 'seller') {
      setLoadingOrders(false)
    }
  }, [user])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    navigate('/')
    window.location.reload()
  }

  function getStatusColor(status) {
    const colors = {
      pending: '#ffc107',
      confirmed: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return <div className="center card" style={{ padding: 30 }}>Loading...</div>
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: 30, marginBottom: 24 }}>
        {/* Profile Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 40,
            color: 'white',
            fontWeight: 700
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p className="muted" style={{ margin: '8px 0 0' }}>{user.email}</p>
          {user.role === 'seller' && (
            <span style={{
              background: '#28a745',
              color: 'white',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              marginTop: 8,
              display: 'inline-block'
            }}>
              Seller Account
            </span>
          )}
        </div>

        {/* Profile Details */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Account Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span className="muted">Name</span>
              <span style={{ fontWeight: 500 }}>{user.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span className="muted">Email</span>
              <span style={{ fontWeight: 500 }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span className="muted">Account Type</span>
              <span style={{ fontWeight: 500 }}>{user.role === 'seller' ? 'Seller' : 'Buyer'}</span>
            </div>
            {user.shopName && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span className="muted">Shop Name</span>
                <span style={{ fontWeight: 500 }}>{user.shopName}</span>
              </div>
            )}
            {user.role !== 'seller' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span className="muted">Total Orders</span>
                <span style={{ fontWeight: 500 }}>{orders.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn"
          style={{
            width: '100%',
            padding: 14,
            fontSize: 16,
            marginTop: 24,
            background: '#dc3545'
          }}
        >
          Logout
        </button>
      </div>

      {/* Order History - Only for buyers, not sellers */}
      {user.role !== 'seller' && (
      <div className="card" style={{ padding: 30 }}>
        <h3 style={{ marginTop: 0, marginBottom: 20 }}>Order History</h3>

        {loadingOrders ? (
          <div className="muted" style={{ textAlign: 'center', padding: 20 }}>Loading orders...</div>
        ) : ordersError ? (
          <div style={{ textAlign: 'center', padding: 20, color: '#dc3545' }}>
            Failed to load orders: {ordersError}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p className="muted">No orders yet</p>
            <button className="btn" onClick={() => navigate('/')} style={{ marginTop: 12 }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div
                key={order._id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 12,
                  padding: 16,
                  background: '#fafafa'
                }}
              >
                {/* Order Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Order ID</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#666' }}>{formatDate(order.createdAt)}</div>
                    <span style={{
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                      <span>{item.name} × {item.qty}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{
                  borderTop: '1px solid #eee',
                  paddingTop: 12,
                  marginTop: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: 13, color: '#666' }}>
                    {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card Payment'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>
                    Total: ₹{order.total}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                    📍 {order.shippingAddress.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  )
}

