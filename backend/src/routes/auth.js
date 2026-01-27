import { Hono } from 'hono'

const app = new Hono()

// Placeholder for authentication routes
app.post('/login', (c) => {
  return c.json({ success: true, message: 'Login endpoint - to be implemented' })
})

app.post('/logout', (c) => {
  return c.json({ success: true, message: 'Logout endpoint - to be implemented' })
})

export default app
