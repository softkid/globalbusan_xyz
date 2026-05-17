import { Hono } from 'hono'
import { generateWidgetScript } from '../modules/telegram-widget.js'
import { getLLMReply } from '../modules/llm.js'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

/**
 * Helper to initialize Supabase client
 */
const getSupabase = (env) => {
  if (env.SUPABASE_URL && env.SUPABASE_KEY) {
    return createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  }
  return null
}

/**
 * POST /send — Widget sends message → AI auto-reply + forward to Telegram
 */
app.post('/send', async (c) => {
  try {
    const { message, name, email, site, sessionId } = await c.req.json()

    if (!message?.trim()) {
      return c.json({ error: 'Message is required' }, 400)
    }

    const botToken = c.env.TELEGRAM_BOT_TOKEN
    const chatId = c.env.TELEGRAM_CHAT_ID

    // 1) Initialize Supabase
    const supabase = getSupabase(c.env)

    // 2) Get AI reply (non-blocking if no FORGE_API_KEY)
    const aiReply = await getLLMReply(c.env, message, site)

    // 3) Persist user message and AI response to Supabase
    if (supabase && sessionId) {
      try {
        // Upsert chat session
        await supabase
          .from('ai_chat_sessions')
          .upsert({ id: sessionId, site: site || 'Unknown' })

        // Save User Message
        await supabase
          .from('ai_chat_messages')
          .insert({
            session_id: sessionId,
            sender: 'user',
            message: message
          })

        // Save AI Response
        await supabase
          .from('ai_chat_messages')
          .insert({
            session_id: sessionId,
            sender: 'bot',
            message: aiReply
          })
      } catch (dbErr) {
        console.error('Database write error in /send:', dbErr)
      }
    }

    // 4) Forward to Telegram (with AI reply included)
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

      const teleRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
      })

      if (teleRes.ok && supabase && sessionId) {
        try {
          const teleData = await teleRes.json()
          const telegramMessageId = teleData?.result?.message_id
          if (telegramMessageId) {
            // Link this specific Telegram notification message to the web session
            await supabase
              .from('ai_chat_sessions')
              .update({ telegram_message_id: telegramMessageId })
              .eq('id', sessionId)
          }
        } catch (linkErr) {
          console.error('Failed to link telegram message ID:', linkErr)
        }
      }
    }

    return c.json({ success: true, aiReply })
  } catch (err) {
    console.error('Telegram send error:', err)
    return c.json({ error: err.message || 'Internal Server Error' }, 500)
  }
})

/**
 * POST /webhook — Telegram sends incoming messages here
 * Users messaging the bot directly get AI auto-replies.
 * Admins replying to forwarded messages get routed to the website chatbot.
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
    const adminChatId = c.env.TELEGRAM_CHAT_ID

    // 1) Initialize Supabase
    const supabase = getSupabase(c.env)

    // 2) Check if this is an admin replying to a forwarded chatbot message
    const replyToMsg = msg.reply_to_message
    if (replyToMsg && supabase) {
      const parentMessageId = replyToMsg.message_id

      // Look up session matching this Telegram message ID
      const { data: session, error: sessionErr } = await supabase
        .from('ai_chat_sessions')
        .select('id')
        .eq('telegram_message_id', parentMessageId)
        .maybeSingle()

      if (session) {
        // Save the admin's message into the database
        await supabase
          .from('ai_chat_messages')
          .insert({
            session_id: session.id,
            sender: 'admin',
            message: userText
          })

        // Return immediately so the AI does not respond to the admin's reply
        return c.json({ ok: true })
      }
    }

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

    // 3) Skip AI auto-reply if the message comes from the admin channel/chat without a reply context
    if (adminChatId && String(chatId) === String(adminChatId)) {
      return c.json({ ok: true })
    }

    // 4) Get AI reply for a direct Telegram user
    const aiReply = await getLLMReply(c.env, userText, 'telegram-direct')

    // Send AI reply back to the user in Telegram
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
 * GET /messages — Retrieve conversation history for a web session
 */
app.get('/messages', async (c) => {
  try {
    const sessionId = c.req.query('sessionId')
    if (!sessionId) {
      return c.json({ error: 'sessionId is required' }, 400)
    }

    const supabase = getSupabase(c.env)
    if (!supabase) {
      return c.json({ success: true, messages: [] })
    }

    const { data: messages, error } = await supabase
      .from('ai_chat_messages')
      .select('sender, message, created_at')
      .eq('session_id', sessionId)
      .order('id', { ascending: true })

    if (error) {
      throw error
    }

    return c.json({ success: true, messages })
  } catch (err) {
    console.error('Retrieve messages error:', err)
    return c.json({ error: err.message || 'Internal Server Error' }, 500)
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
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  })
})

export default app
