import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import usersRouter from '../backend/routes/users.js'
import productsRouter from '../backend/routes/products.js'
import ordersRouter from '../backend/routes/orders.js'
import sellerRouter from '../backend/routes/seller.js'

dotenv.config()

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

// Use routes
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/seller', sellerRouter)

// Health check
app.get('/api', (_req, res) => {
  res.json({ message: 'API is running' })
})

// Export for Vercel
export default app

