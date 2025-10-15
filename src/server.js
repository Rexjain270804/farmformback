import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { connectDB } from './db.js'
import { Registration } from './models.registration.js'
import { createRazorpay } from './razorpay.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '1mb' }))

// Configure CORS with multiple origins
const allowedOrigins = [
  'https://farmformfront1.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000', 
  'http://127.0.0.1:5173'
]

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Health
app.get('/health', (req, res) => res.json({ ok: true }))

// Test API connectivity
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend connected successfully',
    timestamp: new Date().toISOString(),
    cors: 'CORS configured for production'
  })
})

// Init services
const MONGODB_URI = process.env.MONGODB_URI
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_RTtX1l4LbRBZuw'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '5Y66AQEPjZDhEik3pz4kzp6Z'
const razorpay = createRazorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })

// Connect DB
connectDB(MONGODB_URI).then(()=>{
  console.log('Mongo connected')
}).catch(err=>{
  console.error('Mongo connection error', err)
  process.exit(1)
})

// Create order and store form data (pending payment)
app.post('/api/create-order', async (req, res) => {
  try {
    const form = req.body || {}

    // Create a registration record with pending status
    const registration = await Registration.create({
      ...form,
      paymentStatus: 'pending',
    })

    // Create an order on Razorpay (amount in paise; 300 INR = 30000 paise)
    const order = await razorpay.orders.create({
      amount: 30000,
      currency: 'INR',
      receipt: `reg_${registration._id}`,
      notes: {
        farmerName: form.farmerName || '',
        contactNumber: form.contactNumber || ''
      }
    })

    registration.orderId = order.id
    await registration.save()

    res.json({ order, registrationId: registration._id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Verify payment signature and update registration
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}

    const registration = await Registration.findById(registrationId)
    if (!registration) return res.status(404).json({ error: 'Registration not found' })
    if (registration.orderId !== razorpay_order_id) return res.status(400).json({ error: 'Order mismatch' })

    const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (expected !== razorpay_signature) {
      registration.paymentStatus = 'failed'
      registration.signature = razorpay_signature
      registration.paymentId = razorpay_payment_id
      await registration.save()
      return res.status(400).json({ error: 'Signature invalid' })
    }

    registration.paymentStatus = 'paid'
    registration.signature = razorpay_signature
    registration.paymentId = razorpay_payment_id
    registration.paidAt = new Date()
    await registration.save()

    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Verification failed' })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log('Server running on ' + PORT)
})
