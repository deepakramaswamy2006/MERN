const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config({ path: './backend/.env' })

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))
}

// Import routes
const usersRouter = require('../backend/routes/users')
const productsRouter = require('../backend/routes/products')
const ordersRouter = require('../backend/routes/orders')
const sellerRouter = require('../backend/routes/seller')

// Use routes
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/seller', sellerRouter)

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' })
})

// Export for Vercel
module.exports = app

