import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      navigate('/login')
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('currentUser')
    navigate('/')
    window.location.reload()
  }

  if (!user) {
    return <div className="center card" style={{ padding: 30 }}>Loading...</div>
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <div className="card" style={{ padding: 30 }}>
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
              <span className="muted">Member Since</span>
              <span style={{ fontWeight: 500 }}>{new Date().toLocaleDateString()}</span>
            </div>
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
    </div>
  )
}

