import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const data = await login(email, password, role)
      // Store user with token and role
      localStorage.setItem('currentUser', JSON.stringify({
        token: data.token,
        name: data.user.name,
        email: data.user.email,
        id: data.user.id,
        role: data.user.role,
        shopName: data.user.shopName
      }))
      // Redirect based on role
      if (data.user.role === 'seller') {
        window.location.href = '/seller/dashboard'
      } else {
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Login</h2>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>Login as</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: role === 'buyer' ? '2px solid var(--accent)' : '2px solid #ddd',
                  background: role === 'buyer' ? '#f0f9ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={() => setRole('buyer')}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: 600 }}>Buyer</span>
              </label>
              <label
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: role === 'seller' ? '2px solid var(--accent)' : '2px solid #ddd',
                  background: role === 'seller' ? '#f0f9ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={() => setRole('seller')}
                  style={{ display: 'none' }}
                />
                <span style={{ fontWeight: 600 }}>Seller</span>
              </label>
            </div>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <button type="submit" className="btn" style={{ padding: 12, fontSize: 16 }} disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${role === 'buyer' ? 'Buyer' : 'Seller'}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
        {role === 'seller' && (
          <p style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
            Want to become a seller?{' '}
            <Link to="/become-seller" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Register as Seller
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}