import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { rateLimiter } from 'hono-rate-limiter'

// Routes
import donationRoutes from './routes/donation.js'
import investmentRoutes from './routes/investment.js'
import projectRoutes from './routes/project.js'
import statsRoutes from './routes/stats.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'

const app = new Hono()

// Security middleware
app.use('*', secureHeaders())

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))

// Logging middleware
app.use('*', logger())

// Rate limiting (100 requests per 15 minutes)
app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('cf-connecting-ip') || 'anonymous'
}))

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
