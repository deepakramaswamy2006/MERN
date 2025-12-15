import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSellerProducts, addSellerProduct, updateSellerProduct, deleteSellerProduct, fetchSellerStats } from '../api'

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ productCount: 0, totalStock: 0, shopName: '' })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const navigate = useNavigate()

  // Check if user is a seller
  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(user)
    if (parsed.role !== 'seller') {
      alert('Access denied. Seller account required.')
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [prods, st] = await Promise.all([fetchSellerProducts(), fetchSellerStats()])
      setProducts(prods)
      setStats(st)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteSellerProduct(id)
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Seller Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#666' }}>{stats.shopName}</p>
        </div>
        <button className="btn" onClick={() => setShowAddForm(true)}>+ Add Product</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{stats.productCount}</div>
          <div style={{ color: '#666' }}>Products</div>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{stats.totalStock}</div>
          <div style={{ color: '#666' }}>Total Stock</div>
        </div>
      </div>

      {/* Products List */}
      <h2>Your Products</h2>
      {products.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          No products yet. Click "Add Product" to get started!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {products.map(product => (
            <div key={product._id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <img src={product.image} alt={product.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} 
                   onError={e => e.target.src = 'https://via.placeholder.com/80'} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>{product.description}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
                  <span><strong>₹{product.price}</strong></span>
                  <span>Stock: {product.stock}</span>
                  <span>Category: {product.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setEditingProduct(product)} 
                        style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', background: '#fff' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)}
                        style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', background: '#fee', color: '#c00' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddForm || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddForm(false); setEditingProduct(null) }}
          onSave={async (data) => {
            try {
              if (editingProduct) {
                const updated = await updateSellerProduct(editingProduct._id, data)
                setProducts(products.map(p => p._id === editingProduct._id ? updated : p))
              } else {
                const newProduct = await addSellerProduct(data)
                setProducts([newProduct, ...products])
              }
              setShowAddForm(false)
              setEditingProduct(null)
              loadData()
            } catch (err) {
              alert(err.message)
            }
          }}
        />
      )}
    </div>
  )
}

const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Electronics',
  'Dairy',
  'Bakery',
  'Beverages',
  'Snacks',
  'Meat & Seafood',
  'Frozen Foods',
  'Personal Care',
  'Household',
  'Other'
]

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    image: product?.image || '',
    description: product?.description || '',
    category: product?.category || 'Fruits',
    stock: product?.stock || 100
  })
  const [imagePreview, setImagePreview] = useState(product?.image || '')
  const [saving, setSaving] = useState(false)

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result
        setForm({ ...form, image: base64 })
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.price || !form.image || !form.description) {
      alert('Please fill in all required fields')
      return
    }
    setSaving(true)
    await onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
    setSaving(false)
  }

  return (<div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000 }}>
    <div className="card" style={{ padding:24,width:'100%',maxWidth:500,maxHeight:'90vh',overflow:'auto' }}>
      <h2 style={{ marginTop:0 }}>{product ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:12 }}>
        {/* Image Upload */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Product Image *</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:14 }}
          />
          {imagePreview && (
            <div style={{ marginTop: 8 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                onError={e => e.target.style.display = 'none'}
              />
            </div>
          )}
        </label>

        {/* Name field */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Name *</span>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:16 }}
          />
        </label>

        {/* Price field */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Price *</span>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:16 }}
          />
        </label>

        {/* Description field */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Description *</span>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={3}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:16 }}
          />
        </label>

        {/* Category dropdown */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Category</span>
          <select
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:16,background:'#fff',cursor:'pointer' }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {/* Stock field */}
        <label style={{ display:'flex',flexDirection:'column',gap:4 }}>
          <span>Stock</span>
          <input
            type="number"
            value={form.stock}
            onChange={e => setForm({...form, stock: e.target.value})}
            style={{ padding:10,borderRadius:8,border:'1px solid #ddd',fontSize:16 }}
          />
        </label>

        <div style={{ display:'flex',gap:12,marginTop:8 }}>
          <button type="button" onClick={onClose} style={{ flex:1,padding:12,border:'1px solid #ddd',borderRadius:8,cursor:'pointer',background:'#fff' }}>Cancel</button>
          <button type="submit" className="btn" style={{ flex:1,padding:12 }} disabled={saving}>{saving?'Saving...':'Save'}</button>
        </div>
      </form>
    </div>
  </div>)
}

