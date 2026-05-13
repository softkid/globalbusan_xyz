import { Hono } from 'hono'
import { generateWidgetScript } from '../modules/telegram-widget.js'
import { getLLMReply } from '../modules/llm.js'

const app = new Hono()

/**
 * POST /send — Widget sends message → AI auto-reply + forward to Telegram
 */
app.post('/send', async (c) => {
  try {
    const { message, name, email, site } = await c.req.json()

    if (!message?.trim()) {
      return c.json({ error: 'Message is required' }, 400)
    }

    const botToken = c.env.TELEGRAM_BOT_TOKEN
    const chatId = c.env.TELEGRAM_CHAT_ID

    // 1) Get AI reply (non-blocking if no FORGE_API_KEY)
    const aiReply = await getLLMReply(c.env, message, site)

    // 2) Forward to Telegram (with AI reply included)
    if (botToken && chatId) {
      const escape = (s) => s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''

      const text = [
        `💬 <b>새 문의 메시지</b>`,
        `━━━━━━━━━━━━━━━`,
        `📍 사이트: ${escape(site || 'Unknown')}`,
        name ? `👤 이름: ${escape(name)}` : null,
        email ? `📧 이메일: ${escape(email)}` : null,
        ``,
        `📝 메시지:`,
        escape(message),
        ``,
        `🤖 <b>AI 자동응답:</b>`,
        escape(aiReply),
        `━━━━━━━━━━━━━━━`,
        `🕐 ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
      ].filter(Boolean).join('\n')

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
      }).catch(err => console.error('Telegram forward error:', err))
    }

    return c.json({ success: true, aiReply })
  } catch (err) {
    console.error('Telegram send error:', err)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

/**
 * POST /webhook — Telegram sends incoming messages here
 * Users messaging the bot directly get AI auto-replies
 */
app.post('/webhook', async (c) => {
  try {
    const update = await c.req.json()
    const msg = update?.message

    if (!msg?.text || msg.from?.is_bot) {
      return c.json({ ok: true })
    }

    const botToken = c.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return c.json({ ok: true })
    }

    const userText = msg.text
    const chatId = msg.chat.id
    const userName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ')

    // Skip commands for now (just /start)
    if (userText === '/start') {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `안녕하세요 ${userName}님! 🤖\n\nAgentumi AI 어시스턴트입니다.\n무엇이든 물어보세요. AI가 자동으로 답변해드립니다.`,
          parse_mode: 'HTML'
        })
      })
      return c.json({ ok: true })
    }

    // Get AI reply
    const aiReply = await getLLMReply(c.env, userText, 'telegram-direct')

    // Send AI reply back to the user
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: aiReply,
        reply_to_message_id: msg.message_id
      })
    })

    // Also notify admin if it's not the admin chatting
    const adminChatId = c.env.TELEGRAM_CHAT_ID
    if (adminChatId && String(chatId) !== String(adminChatId)) {
      const escape = (s) => s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''
      const adminText = [
        `📩 <b>텔레그램 직접 문의</b>`,
        `━━━━━━━━━━━━━━━`,
        `👤 ${escape(userName)} (@${msg.from.username || 'no-username'})`,
        `📝 ${escape(userText)}`,
        `🤖 AI응답: ${escape(aiReply)}`,
        `━━━━━━━━━━━━━━━`
      ].join('\n')

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: adminChatId, text: adminText, parse_mode: 'HTML' })
      }).catch(() => {})
    }

    return c.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return c.json({ ok: true }) // Always 200 to Telegram
  }
})

/**
 * GET /widget.js — Serves the embeddable chatbot widget script
 */
app.get('/widget.js', async (c) => {
  const backendUrl = new URL(c.req.url).origin
  const script = generateWidgetScript(backendUrl)

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  })
})

export default app
