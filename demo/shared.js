import { useDataRef, useDataAction } from '../src/index.js';

const REPLIES = [
  '好的，我来帮你分析一下这个问题。从目前的情况来看，有几个关键点需要注意：\n\n1. 首先确认输入数据的格式是否正确\n2. 检查相关配置是否生效\n3. 如果以上都没有问题，可以尝试重启服务\n\n还有其他需要我帮忙的吗？',
  '这是一个很好的问题！让我来解释一下：\n\n这个功能的实现思路大致如下——先收集用户输入，然后经过处理后返回结果。关键在于每一步的错误处理都要到位。',
  '明白了，我来看看。根据你描述的情况，建议按以下步骤排查：\n\n- 检查网络连接\n- 确认权限设置\n- 清理缓存后再试\n\n通常第一步就能解决问题。',
  '收到！这个需求用我们的方案完全能覆盖。核心思路是把数据流拆成三个阶段：输入 → 处理 → 输出，每一阶段都可以独立测试和替换。',
  '好的，根据你的需求，我建议这样做：\n\n```javascript\n// 示例代码\nconst result = await process(input);\nconsole.log(result);\n```\n\n如果遇到问题随时告诉我。',
];

let refs = null;
let sessions = [];
let currentId = null;
let model = 'GPT-4o';
let streamingTimer = null;
let pendingFile = null;

// ── session helpers ──

function now() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }

function createSession(title) {
  const s = { id: Date.now(), title: title || '新对话', messages: [] };
  sessions.unshift(s);
  return s;
}

function current() { return sessions.find(s => s.id === currentId); }

function renderSessions(filter = '') {
  const list = refs.sessionList;
  if (!list) return;
  list.innerHTML = '';
  const term = filter.toLowerCase();
  sessions
    .filter(s => !term || s.title.toLowerCase().includes(term))
    .forEach(s => {
      const li = document.createElement('div');
      li.dataset.action = 'selectSession';
      li.dataset.sessionId = s.id;
      li.className = s.id === currentId ? 'session-item active' : 'session-item';
      li.innerHTML = `<span class="session-title">${esc(s.title)}</span><button data-action="deleteSession" data-session-id="${s.id}" class="btn-del" title="删除">×</button>`;
      list.appendChild(li);
    });
}

function renderMessages() {
  const box = refs.chatMessages;
  const welcome = refs.welcomeScreen;
  const s = current();
  if (!s || s.messages.length === 0) {
    if (box) box.innerHTML = '';
    if (welcome) welcome.style.display = '';
    return;
  }
  if (welcome) welcome.style.display = 'none';
  if (!box) return;
  box.innerHTML = s.messages.map(m =>
    `<div class="msg ${m.role}"><div class="bubble">${esc(m.text)}</div><div class="time">${m.time}</div></div>`
  ).join('');
  box.scrollTop = box.scrollHeight;
}

function startStream(replyText, bubble) {
  let i = 0;
  if (refs.typingIndicator) refs.typingIndicator.style.display = '';
  streamingTimer = setInterval(() => {
    if (i < replyText.length) {
      bubble.textContent += replyText[i++];
      const box = refs.chatMessages;
      if (box) box.scrollTop = box.scrollHeight;
    } else {
      clearInterval(streamingTimer);
      streamingTimer = null;
      if (refs.typingIndicator) refs.typingIndicator.style.display = 'none';
    }
  }, 30);
}

function sendMessage(text, skipStream) {
  if (streamingTimer) return; // block during streaming
  const s = current();
  if (!s) return;
  const msg = text || refs.chatInput?.value?.trim();
  if (!msg) return;
  s.messages.push({ role: 'user', text: msg, time: now() });
  if (refs.chatInput) refs.chatInput.value = '';
  pendingFile = null;
  renderMessages();
  document.querySelectorAll('[data-ref="fileLabel"]').forEach(el => el.textContent = '');

  // AI reply
  if (!skipStream) {
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    const aiMsg = { role: 'assistant', text: '', time: now() };
    s.messages.push(aiMsg);
    renderMessages();
    const bubbles = refs.chatMessages?.querySelectorAll('.bubble');
    const lastBubble = bubbles?.[bubbles.length - 1];
    if (lastBubble) startStream(reply, lastBubble);
    // store full text after stream
    const checkDone = setInterval(() => {
      if (!streamingTimer) {
        clearInterval(checkDone);
        aiMsg.text = reply;
      }
    }, 50);
  }
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── init ──

export function init(root) {
  refs = useDataRef(root);

  useDataAction({
    root,
    actions: {
      sendMessage(ev, el) {
        const text = ev?.target?.closest?.('[data-ref="chatInput"]')?.value?.trim()
          || refs.chatInput?.value?.trim();
        sendMessage(text);
      },

      newSession() {
        if (streamingTimer) return;
        const s = createSession();
        currentId = s.id;
        renderSessions(refs.searchInput?.value || '');
        renderMessages();
      },

      selectSession(ev, el) {
        if (streamingTimer) return;
        const id = Number(el.dataset.sessionId);
        if (id && sessions.find(s => s.id === id)) {
          currentId = id;
          renderSessions(refs.searchInput?.value || '');
          renderMessages();
        }
      },

      deleteSession(ev, el) {
        ev.stopPropagation();
        if (streamingTimer) return;
        const id = Number(el.dataset.sessionId);
        sessions = sessions.filter(s => s.id !== id);
        if (currentId === id) {
          currentId = sessions.length > 0 ? sessions[0].id : null;
        }
        if (!currentId) {
          const s = createSession();
          currentId = s.id;
        }
        renderSessions(refs.searchInput?.value || '');
        renderMessages();
      },

      searchSession() {
        renderSessions(refs.searchInput?.value || '');
      },

      quickQuestion(ev, el) {
        const text = el.textContent.trim();
        if (text) sendMessage(text);
      },

      switchModel(ev, el) {
        model = el.value || el.textContent.trim();
        const sel = refs.modelSelector;
        if (sel) sel.textContent = model;
      },

      clearMessages() {
        if (streamingTimer) return;
        const s = current();
        if (s) { s.messages = []; }
        renderMessages();
      },

      uploadFile(ev, el) {
        // trigger hidden file input near the upload button
        const input = el.parentElement?.querySelector('input[type="file"]')
          || root.querySelector('input[type="file"][data-ref="fileInput"]');
        if (input) {
          input.onchange = () => {
            if (input.files.length > 0) {
              pendingFile = input.files[0].name;
              document.querySelectorAll('[data-ref="fileLabel"]').forEach(l => l.textContent = '📎 ' + pendingFile);
            }
            input.value = '';
          };
          input.click();
        }
      },

      toggleTheme() {
        const html = document.documentElement;
        html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
      },
    }
  });

  // Enter key to send (Shift+Enter for newline)
  if (refs.chatInput) {
    refs.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Search input live filtering
  if (refs.searchInput) {
    refs.searchInput.addEventListener('input', () => renderSessions(refs.searchInput.value || ''));
  }

  // Init: create a default session
  const s = createSession();
  currentId = s.id;
  renderSessions();
  renderMessages();
  if (refs.modelSelector && refs.modelSelector.tagName === 'SELECT') {
    model = refs.modelSelector.value;
  }
}
