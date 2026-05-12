import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

// API Routes for the Roadmap Web App
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Endpoint to fetch current roadmap data (could be extended to fetch from D1/KV)
app.get('/api/roadmap', (c) => {
  return c.json({
    message: "Busan Maritime Capital & Digital Hub 2.0 API",
    source: "2026-2030 Roadmap Data"
  })
})

export default app
