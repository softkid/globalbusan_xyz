import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

// Routes
import donationRoutes from './routes/donation.js'
import investmentRoutes from './routes/investment.js'
import projectRoutes from './routes/project.js'
import statsRoutes from './routes/stats.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import telegramRoutes from './routes/telegram.js'
import aiRoutes from './routes/ai.js'

const app = new Hono()

// Security middleware
app.use('*', secureHeaders())

// CORS middleware
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://globalbusan.xyz',
    'https://edu.globalbusan.xyz',
    'https://hub.globalbusan.xyz',
    'https://hajungwoo.globalbusan.xyz',
    'https://agentumi.xyz',
    'https://www.agentumi.xyz'
  ],
  credentials: true
}))

// Logging middleware
app.use('*', logger())

// Simple rate limiting (CF Workers compatible)
const rateLimitMap = new Map()
app.use('/api/*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || 'anonymous'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const limit = 100

  const entry = rateLimitMap.get(ip)
  if (entry && now - entry.start < windowMs) {
    entry.count++
    if (entry.count > limit) {
      return c.json({ error: 'Too many requests' }, 429)
    }
  } else {
    rateLimitMap.set(ip, { start: now, count: 1 })
  }

  await next()
})

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: c.env?.ENVIRONMENT || 'development'
  })
})

// API Routes
app.route('/api/donations', donationRoutes)
app.route('/api/investments', investmentRoutes)
app.route('/api/projects', projectRoutes)
app.route('/api/stats', statsRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/chat', chatRoutes)
app.route('/api/telegram', telegramRoutes)
app.route('/api/ai', aiRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  }, err.status || 500)
})

export default app
