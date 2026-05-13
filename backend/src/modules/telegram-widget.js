/**
 * Telegram Chatbot Widget Script Generator
 * 
 * Generates a self-contained JavaScript widget that renders a floating
 * chat button with AI auto-reply. Uses Shadow DOM for CSS isolation.
 */

export function generateWidgetScript(backendUrl) {
  return `(function() {
  'use strict';

  var scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  var config = {
    backendUrl: '${backendUrl}',
    site: (scriptTag && scriptTag.getAttribute('data-site')) || window.location.hostname,
    color: (scriptTag && scriptTag.getAttribute('data-color')) || '#6C5CE7',
    position: (scriptTag && scriptTag.getAttribute('data-position')) || 'right',
    title: (scriptTag && scriptTag.getAttribute('data-title')) || '💬 문의하기'
  };

  var container = document.createElement('div');
  container.id = 'agentumi-chatbot-widget';
  document.body.appendChild(container);

  var shadow = container.attachShadow({ mode: 'closed' });

  var styles = document.createElement('style');
  styles.textContent = \`
    :host {
      --primary: \${config.color};
      --primary-dark: color-mix(in srgb, \${config.color} 80%, #000);
      --bg: #ffffff;
      --bg-secondary: #f8f9fa;
      --text: #1a1a2e;
      --text-secondary: #6c757d;
      --border: #e9ecef;
      --shadow: 0 8px 32px rgba(0,0,0,0.12);
      --radius: 16px;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --bg: #1a1a2e;
        --bg-secondary: #16213e;
        --text: #eaeaea;
        --text-secondary: #a0a0b0;
        --border: #2a2a4a;
        --shadow: 0 8px 32px rgba(0,0,0,0.4);
      }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .widget-btn {
      position: fixed;
      bottom: 24px;
      \${config.position}: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(108,92,231,0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999999;
      animation: pulse 2s infinite;
    }
    .widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(108,92,231,0.5);
    }
    .widget-btn svg { width: 28px; height: 28px; fill: white; transition: transform 0.3s ease; }
    .widget-btn.open svg { transform: rotate(45deg); }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(108,92,231,0.4); }
      50% { box-shadow: 0 4px 30px rgba(108,92,231,0.6); }
    }

    .widget-panel {
      position: fixed;
      bottom: 100px;
      \${config.position}: 24px;
      width: 380px;
      max-height: 560px;
      background: var(--bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      z-index: 999998;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .widget-panel.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .panel-header {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 18px 20px;
      font-size: 16px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .panel-header .subtitle {
      font-size: 11px;
      opacity: 0.85;
      font-weight: 400;
      margin-top: 3px;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 200px;
      max-height: 320px;
    }

    .msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
      animation: fadeIn 0.3s ease;
    }
    .msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border-bottom-right-radius: 4px;
    }
    .msg.bot {
      align-self: flex-start;
      background: var(--bg-secondary);
      color: var(--text);
      border: 1px solid var(--border);
      border-bottom-left-radius: 4px;
    }
    .msg.bot .label {
      font-size: 10px;
      color: var(--primary);
      font-weight: 600;
      margin-bottom: 4px;
    }
    .msg.system {
      align-self: center;
      background: transparent;
      color: var(--text-secondary);
      font-size: 11px;
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    .chat-input-area input {
      flex: 1;
      padding: 10px 14px;
      border: 1.5px solid var(--border);
      border-radius: 24px;
      background: var(--bg-secondary);
      color: var(--text);
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input-area input:focus {
      border-color: var(--primary);
    }
    .chat-input-area button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      flex-shrink: 0;
    }
    .chat-input-area button:hover { transform: scale(1.05); }
    .chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .chat-input-area button svg { width: 18px; height: 18px; fill: white; }

    .typing-dots {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }
    .typing-dots span {
      width: 6px; height: 6px;
      background: var(--text-secondary);
      border-radius: 50%;
      animation: blink 1.4s infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    .powered-by {
      text-align: center;
      padding: 6px;
      font-size: 10px;
      color: var(--text-secondary);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .widget-panel {
        width: calc(100vw - 32px);
        \${config.position}: 16px;
        bottom: 90px;
        max-height: calc(100vh - 120px);
      }
      .widget-btn { bottom: 16px; \${config.position}: 16px; }
    }
  \`;

  var wrapper = document.createElement('div');
  wrapper.innerHTML = \`
    <button class="widget-btn" id="agentumi-toggle" aria-label="Open chat">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    </button>

    <div class="widget-panel" id="agentumi-panel">
      <div class="panel-header">
        <div>\${config.title}</div>
        <div class="subtitle">🤖 AI가 즉시 답변 · 담당자에게도 전달됩니다</div>
      </div>
      <div class="chat-messages" id="agentumi-messages">
        <div class="msg bot">
          <div class="label">🤖 AI 어시스턴트</div>
          안녕하세요! 무엇을 도와드릴까요?
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="agentumi-input" placeholder="메시지를 입력하세요..." />
        <button id="agentumi-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="powered-by">Powered by Agentumi AI</div>
    </div>
  \`;

  shadow.appendChild(styles);
  shadow.appendChild(wrapper);

  var btn = shadow.getElementById('agentumi-toggle');
  var panel = shadow.getElementById('agentumi-panel');
  var sendBtn = shadow.getElementById('agentumi-send');
  var input = shadow.getElementById('agentumi-input');
  var messagesEl = shadow.getElementById('agentumi-messages');
  var isOpen = false;
  var sending = false;

  btn.addEventListener('click', function() {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    if (isOpen) input.focus();
  });

  function addMessage(text, type) {
    var div = document.createElement('div');
    div.className = 'msg ' + type;
    if (type === 'bot') {
      div.innerHTML = '<div class="label">🤖 AI 어시스턴트</div>' + escapeHtml(text);
    } else {
      div.textContent = text;
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="label">🤖 AI 어시스턴트</div><div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    var el = shadow.getElementById('typing-indicator');
    if (el) el.remove();
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  async function sendMessage() {
    var text = input.value.trim();
    if (!text || sending) return;

    sending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'user');
    showTyping();

    try {
      var res = await fetch(config.backendUrl + '/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          site: config.site
        })
      });
      var data = await res.json();
      hideTyping();

      if (data.aiReply) {
        addMessage(data.aiReply, 'bot');
      } else if (data.success) {
        addMessage('메시지가 전달되었습니다. 곧 답변드리겠습니다.', 'bot');
      } else {
        addMessage('전송에 실패했습니다. 다시 시도해주세요.', 'bot');
      }
    } catch (err) {
      hideTyping();
      addMessage('네트워크 오류가 발생했습니다.', 'bot');
    }

    sending = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.addEventListener('click', function(e) {
    if (isOpen && !container.contains(e.target)) {
      isOpen = false;
      btn.classList.remove('open');
      panel.classList.remove('open');
    }
  });
})();`;
}
