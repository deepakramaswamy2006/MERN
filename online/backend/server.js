const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
const orderRoutes = require('./routes/orders')
const sellerRoutes = require('./routes/seller')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/seller', sellerRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ZepClone API is running!' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

