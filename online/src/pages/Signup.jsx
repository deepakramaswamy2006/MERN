import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
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

    // Mock signup - in real app, call backend API
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists')
      return
    }

    users.push({ name, email, password })
    localStorage.setItem('users', JSON.stringify(users))

    // Redirect to login page after signup (don't auto-login)
    alert('Account created successfully! Please login.')
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Sign Up</h2>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
            />
          </label>

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

          <button type="submit" className="btn" style={{ padding: 12, fontSize: 16 }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

