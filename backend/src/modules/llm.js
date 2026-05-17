import { createClient } from '@supabase/supabase-js'

/**
 * Shared LLM helper — calls Google Gemini API directly
 * Free tier: 15 RPM / 1M TPM for gemini-2.5-flash
 */

const SYSTEM_PROMPT = `당신은 부산 AI 플랫폼(ai.globalbusan.xyz) 및 Agentumi의 공식 AI 어시스턴트입니다. 사용자의 질문에 친절하고 전문적으로 답변합니다.

역할:
- 웹사이트 방문자의 문의에 신속하고 정확하게 답변
- 아래에 제공된 실시간 플랫폼 데이터를 바탕으로 진행 중인 교육 과정, 무료 설명회 일정, 주간 챌린지, 파트너 전문가 등의 최신 정보를 정확하게 안내
- "외부 웹사이트라서 일정을 확인할 수 없다"고 하지 마시고, 제공되는 실시간 플랫폼 데이터를 바탕으로 즉시 설명회 일정이나 장소, 수강료 등을 친절히 알려주세요.
- 한국어와 영어 모두 지원
- 답변을 간결하고 자연스럽게 유지 (최대 500자)

제공된 데이터에 없는 상세 문의거나 답변하기 어려운 질문이라면 "담당자에게 전달하겠습니다"로 안내하고 담당자 연락을 기다리게 하세요.`;

/**
 * Fetch real-time data from Supabase to provide active context
 * @param {object} env - Cloudflare Worker env bindings
 * @returns {Promise<string>} Context string formatted with live DB data
 */
async function getRealtimeContext(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    return ''
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)

    // Fetch courses, events, challenges, and experts in parallel (Edge compatible)
    const [coursesRes, eventsRes, challengesRes, expertsRes] = await Promise.all([
      supabase
        .from('ai_courses')
        .select('title, description, instructor, price, region, target, tag, emoji')
        .limit(10),
      supabase
        .from('ai_event_reservations')
        .select('event_title, event_date, event_time, event_location, event_type, max_spots')
        .limit(10),
      supabase
        .from('ai_challenges')
        .select('title, description, emoji, difficulty, points, deadline')
        .limit(5),
      supabase
        .from('ai_experts')
        .select('name, role, bio, skills, rating, region')
        .limit(5)
    ])

    let context = '\n\n【실시간 플랫폼 데이터 (Real-time Platform Data)】\n'

    // 1) Courses
    if (coursesRes.data && coursesRes.data.length > 0) {
      context += '\n■ 진행 중인 AI 교육 과정:\n'
      coursesRes.data.forEach(c => {
        context += `- [${c.emoji || '📚'} ${c.title}] 강사: ${c.instructor}, 수강료: ${c.price}, 장소: ${c.region}, 대상: ${c.target} (${c.description || ''})\n`
      })
    }

    // 2) Events
    if (eventsRes.data && eventsRes.data.length > 0) {
      context += '\n■ 무료 설명회 및 이벤트 일정:\n'
      eventsRes.data.forEach(e => {
        const dateStr = new Date(e.event_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
        context += `- [📅 ${e.event_title}] 날짜: ${dateStr} (${e.event_date}), 시간: ${e.event_time || ''}, 장소: ${e.event_location || ''}, 유형: ${e.event_type || ''} (정원: ${e.max_spots || 20}명)\n`
      })
    }

    // 3) Challenges
    if (challengesRes.data && challengesRes.data.length > 0) {
      context += '\n■ 진행 중인 챌린지:\n'
      challengesRes.data.forEach(ch => {
        context += `- [${ch.emoji || '🎯'} ${ch.title}] 난이도: ${ch.difficulty}, 포인트: ${ch.points}, 마감: ${ch.deadline} (${ch.description || ''})\n`
      })
    }

    // 4) Experts
    if (expertsRes.data && expertsRes.data.length > 0) {
      context += '\n■ 등록된 AI 전문가:\n'
      expertsRes.data.forEach(ex => {
        context += `- [👤 ${ex.name}] 역할: ${ex.role || '전문가'}, 분야: ${(ex.skills || []).join(', ')}, 평점: ${ex.rating || 0}, 지역: ${ex.region || ''} (${ex.bio || ''})\n`
      })
    }

    return context
  } catch (err) {
    console.error('Failed to fetch realtime context:', err)
    return ''
  }
}

/**
 * Call Google Gemini API and return a text response
 * @param {object} env - Cloudflare Worker env bindings
 * @param {string} userMessage - The user's message
 * @param {string} [site] - The originating site for context
 * @returns {Promise<string>} AI response text
 */
export async function getLLMReply(env, userMessage, site) {
  const apiKey = env?.GEMINI_API_KEY;

  if (!apiKey) {
    return '현재 AI 자동응답이 설정되지 않았습니다. 담당자가 곧 확인하겠습니다.';
  }

  try {
    // 1) Fetch active platform context from DB in real time
    const realtimeContext = await getRealtimeContext(env)
    const dynamicSystemInstruction = SYSTEM_PROMPT + realtimeContext

    // 2) Request answer from Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: dynamicSystemInstruction }]
          },
          contents: [{
            role: 'user',
            parts: [{ text: `[문의 출처 사이트: ${site || 'unknown'}]\n\n질문: ${userMessage}` }]
          }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.5 // Lower temperature for more factual database-based replies
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return '죄송합니다. 잠시 후 다시 시도해주세요.';
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer || '답변을 생성할 수 없습니다.';
  } catch (err) {
    console.error('LLM call failed:', err);
    return '죄송합니다. 일시적인 오류가 발생했습니다.';
  }
}
