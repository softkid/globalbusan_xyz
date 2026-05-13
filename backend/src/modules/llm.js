/**
 * Shared LLM helper — calls Google Gemini API directly
 * Free tier: 15 RPM / 1M TPM for gemini-2.0-flash
 */

const SYSTEM_PROMPT = `당신은 Agentumi의 AI 어시스턴트입니다. 사용자의 질문에 친절하고 전문적으로 답변합니다.

역할:
- 웹사이트 방문자의 문의에 신속하고 정확하게 답변
- 프로젝트, 서비스, 협업 관련 질문에 도움 제공
- 한국어와 영어 모두 지원
- 답변을 간결하게 유지 (최대 500자)

답변할 수 없는 질문이면 "담당자에게 전달하겠습니다"로 안내하세요.`;

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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [{
            role: 'user',
            parts: [{ text: `[사이트: ${site || 'unknown'}]\n\n${userMessage}` }]
          }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7
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
