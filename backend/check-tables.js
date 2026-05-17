import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sbmtrofjnuwqtyovakiq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibXRyb2ZqbnV3cXR5b3Zha2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDg1MzcsImV4cCI6MjA3NTE4NDUzN30.dtHYamkdveCQGz-ORVRkAZza74ZG59HS2sVMkm0rMYc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('--- Sessions ---')
  const { data: sData, error: sErr } = await supabase.from('ai_chat_sessions').select('*').order('created_at', { ascending: false }).limit(20)
  if (sErr) {
    console.error('ai_chat_sessions table error:', sErr.message)
  } else {
    console.log(JSON.stringify(sData, null, 2))
  }

  console.log('--- Messages ---')
  const { data: mData, error: mErr } = await supabase.from('ai_chat_messages').select('*').order('created_at', { ascending: false }).limit(20)
  if (mErr) {
    console.error('ai_chat_messages table error:', mErr.message)
  } else {
    console.log(JSON.stringify(mData, null, 2))
  }
}

test()
