import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupSeller } from '../api'

export default function SellerSignup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [shopName, setShopName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !shopName || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signupSeller(name, email, password, shopName)
      alert('Seller account created successfully! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 450, margin: '40px auto' }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Become a Seller</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 24 }}>
          Start selling your products today!
        </p>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Your Name</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Shop Name</span>
            <input
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="My Awesome Shop"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seller@example.com"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

          <button type="submit" className="btn" style={{ padding: 12, fontSize: 16 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Seller Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Login
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
          Want to buy instead?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign up as Buyer
          </Link>
        </p>
      </div>
    </div>
  )
}

