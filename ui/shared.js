import { useDataRef } from '../src/index.js';
import { useDataAction } from '../src/index.js';

// ═══════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════

const MODELS = [
  { id: 'deepseek-v4',  name: 'DeepSeek V4',  provider: 'DeepSeek'  },
  { id: 'gpt-4o',       name: 'GPT-4o',       provider: 'OpenAI'    },
  { id: 'claude-4',     name: 'Claude 4',     provider: 'Anthropic' },
  { id: 'gemini-2',     name: 'Gemini 2',     provider: 'Google'    },
];

const AI_RESPONSES = [
  '这是一个很好的问题！从架构角度来看，我建议采用模块化的设计，将不同功能拆分到独立的 hook 中管理。这样测试和维护都会方便很多。',
  '好的，我来帮你实现这个功能。核心思路是用 `useState` 管理状态，`useEffect` 处理副作用，再加一个自定义 hook 封装复用逻辑。',
  '我理解你的需求。这里有几种方案：\n\n1. **Context + useReducer** — 适合中大型应用\n2. **Zustand** — 轻量、简洁\n3. **Props 逐层传递** — 适合小型组件树\n\n推荐方案一，可维护性最好。',
  '这个问题涉及到性能优化。可以用 `useMemo` 缓存计算结果，`useCallback` 稳定函数引用，避免子组件不必要的重渲染。',
  '让我查一下相关文档… 根据最新 API，这个接口已经更新了，推荐使用新的写法，旧的会在下一个大版本废弃。',
  '这是一个常见的坑。原因是闭包捕获了旧的 state 值，用函数式更新 `setState(prev => …)` 可以解决。',
  '思路是对的，但要注意边界情况：空数组、loading 状态、错误处理。把这些覆盖到，代码就健壮了。',
  '可以用组合模式来实现。把公共逻辑提取到基础组件，变化的部分通过 `props` 或 `children` 注入，灵活又干净。',
];

const QUICK_QUESTIONS = [
  { icon: 'shapes',      label: 'Button 组件' },
  { icon: 'table',       label: 'Table 组件' },
  { icon: 'window-maximize', label: 'Modal 组件' },
  { icon: 'arrow-right-arrow-left', label: '数据流方案' },
  { icon: 'code',        label: 'TypeScript 类型' },
  { icon: 'server',      label: 'API 设计' },
];

let state = {
  sessions:         [],
  currentSessionId: null,
  currentModel:     'deepseek-v4',
  isProcessing:     false,
  searchQuery:      '',
};

// ═══════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════

let _idCounter = Date.now();
function uid() { return `id-${++_idCounter}`; }

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min}分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  if (hr < 48) return '昨天';
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}天前`;
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatMsgCount(n) {
  if (n === 0) return '';
  if (n < 100) return `${n} 条消息`;
  return '99+ 条消息';
}

// ═══════════════════════════════════════════════
// DOM refs
// ═══════════════════════════════════════════════

const root = document.body;
const refs = useDataRef(root);

// ═══════════════════════════════════════════════
// Render functions
// ═══════════════════════════════════════════════

function renderSessionList() {
  const container = refs.sessionList;
  if (!container || !container.querySelector) return;

  // Keep the "最近对话" header
  let header = container.querySelector('.session-list-header');
  if (!header) {
    header = document.createElement('div');
    header.className = 'session-list-header text-[10px] uppercase tracking-widest text-zinc-600 px-3 py-2 font-semibold';
    header.textContent = '最近对话';
    container.innerHTML = '';
    container.appendChild(header);
  } else {
    // Clear everything after the header
    while (header.nextElementSibling) header.nextElementSibling.remove();
  }

  const filtered = state.searchQuery
    ? state.sessions.filter(s => s.title.includes(state.searchQuery))
    : state.sessions;

  for (const sess of filtered) {
    const isActive = sess.id === state.currentSessionId;
    const item = document.createElement('div');
    item.className = `conversation-item px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-2.5 group ${isActive ? 'active' : ''}`;
    item.dataset.action = 'selectSession';
    item.dataset.sessionId = sess.id;

    const icon = document.createElement('i');
    icon.className = 'fa-regular fa-message text-xs text-zinc-500';

    const span = document.createElement('span');
    span.className = 'text-sm truncate flex-1';
    span.textContent = sess.title;

    const time = document.createElement('span');
    time.className = 'text-[10px] text-zinc-600';
    time.textContent = timeAgo(sess.updatedAt || sess.createdAt);

    const delBtn = document.createElement('button');
    delBtn.className = 'opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 text-[11px] px-1';
    delBtn.dataset.action = 'deleteSession';
    delBtn.dataset.sessionId = sess.id;
    delBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    item.appendChild(icon);
    item.appendChild(span);
    item.appendChild(time);
    item.appendChild(delBtn);
    container.appendChild(item);
  }

  // Empty state
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'px-3 py-4 text-center text-xs text-zinc-600';
    empty.textContent = state.searchQuery ? '没有匹配的对话' : '暂无对话，点击上方新建';
    container.appendChild(empty);
  }
}

function renderMessages() {
  const container = refs.chatMessages;
  if (!container) return;

  // Remove all rendered message elements but preserve the welcome screen
  container.querySelectorAll(':scope > :not([data-ref="welcomeScreen"])').forEach(el => el.remove());

  const session = state.sessions.find(s => s.id === state.currentSessionId);
  if (!session || session.messages.length === 0) {
    showWelcome(true);
    return;
  }
  showWelcome(false);

  for (const msg of session.messages) {
    container.appendChild(createMessageEl(msg));
  }
  scrollToBottom();
}

function createMessageEl(msg) {
  const isUser = msg.role === 'user';

  if (isUser) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex justify-end msg-wrapper';
    wrapper.innerHTML = `
      <div class="msg-user max-w-[70%] rounded-2xl px-5 py-3.5">
        <p class="text-sm leading-relaxed">${escapeHtml(msg.content)}</p>
      </div>`;
    return wrapper;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'msg-ai rounded-2xl px-5 py-3.5 msg-wrapper';
  wrapper.innerHTML = `
    <div class="min-w-0">
      <div class="msg-content text-sm leading-relaxed"></div>
      <div class="flex gap-2 mt-2 flex-wrap quick-btns" style="display:none">
        ${QUICK_QUESTIONS.map(q => `
          <button class="text-xs px-3 py-1.5 rounded-lg bg-[#111] border border-[#222] text-zinc-300 hover:border-zinc-600 transition-all" data-action="quickQuestion">
            <i class="fa-solid fa-${q.icon} mr-1.5 text-indigo-400"></i>${q.label}
          </button>
        `).join('')}
      </div>
      <div class="flex items-center gap-0.5 msg-actions">
        <button data-action="copyMessage" class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]" style="color:var(--text-muted2);" title="复制">
          <i class="fa-regular fa-copy text-xs"></i>
        </button>
        <button data-action="likeMessage" class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]" style="color:var(--text-muted2);" title="赞">
          <i class="fa-regular fa-thumbs-up text-xs"></i>
        </button>
        <button data-action="dislikeMessage" class="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]" style="color:var(--text-muted2);" title="踩">
          <i class="fa-regular fa-thumbs-down text-xs"></i>
        </button>
      </div>
    </div>`;

  // Fill content then format any code blocks
  const contentEl = wrapper.querySelector('.msg-content');
  contentEl.textContent = msg.content;
  formatCodeBlocks(contentEl);

  return wrapper;
}

function formatCodeBlocks(container) {
  const html = container.innerHTML;
  const parts = html.split(/(```[\s\S]*?```)/g);
  if (parts.length === 1) return;

  container.innerHTML = '';
  for (const part of parts) {
    if (part.startsWith('```')) {
      const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
      const lang = (part.match(/```(\w*)/) || [])[1] || '';
      const block = document.createElement('div');
      block.className = 'code-block overflow-hidden my-3';
      block.innerHTML = `
        <div class="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1f1f1f]">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
          </div>
          <span class="text-[10px] text-zinc-600 font-mono">${lang || 'code'}</span>
          <button class="text-zinc-600 hover:text-zinc-400 transition-colors copy-btn">
            <i class="fa-regular fa-copy text-xs"></i>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-zinc-300"><code>${escapeHtml(code)}</code></pre>`;
      container.appendChild(block);

      // Copy button
      const copyBtn = block.querySelector('.copy-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-check text-xs text-green-400"></i>';
          setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy text-xs"></i>'; }, 2000);
        });
      });
    } else if (part.trim()) {
      const p = document.createElement('span');
      p.innerHTML = part;
      container.appendChild(p);
    }
  }
}

function showWelcome(show) {
  const welcome = refs.welcomeScreen;
  const messages = refs.chatMessages;
  if (!welcome || !messages) return;
  welcome.style.display = show ? '' : 'none';
}

function updateHeader() {
  const session = state.sessions.find(s => s.id === state.currentSessionId);
  const titleEl = refs.sessionTitle;
  const countEl = refs.messageCount;
  if (titleEl) titleEl.textContent = session ? session.title : 'AI 聊天助手';
  if (countEl && session) countEl.textContent = formatMsgCount(session.messages.length);
}

function updateModelSelector() {
  const sel = refs.modelSelector;
  if (!sel) return;
  const model = MODELS.find(m => m.id === state.currentModel) || MODELS[0];
  // The model name is the second text span in the selector
  const spans = sel.querySelectorAll('span');
  const nameSpan = [...spans].find(s => s.className.includes('text-zinc-') || s.className.includes('text-['));
  if (nameSpan) nameSpan.textContent = model.id;
}

function scrollToBottom() {
  const container = refs.chatMessages;
  if (container) setTimeout(() => { container.scrollTop = container.scrollHeight; }, 50);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════
// Typewriter Effect
// ═══════════════════════════════════════════════

function typewriter(el, text, speed = 25) {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = '';
    function next() {
      if (i >= text.length) { resolve(); return; }
      el.textContent += text[i++];
      scrollToBottom();
      setTimeout(next, speed);
    }
    next();
  });
}

// ═══════════════════════════════════════════════
// AI Reply
// ═══════════════════════════════════════════════

function showTyping(show) {
  const indicator = refs.typingIndicator;
  if (indicator) indicator.style.display = show ? '' : 'none';
  scrollToBottom();
}

function simulateAiReply(userMessage) {
  const session = state.sessions.find(s => s.id === state.currentSessionId);
  if (!session) return;

  state.isProcessing = true;

  // Show typing indicator
  const container = refs.chatMessages;
  const typingEl = document.createElement('div');
  typingEl.className = 'msg-ai rounded-2xl px-5 py-3.5 msg-wrapper';
  typingEl.dataset.typing = 'true';
  typingEl.innerHTML = `
    <div class="flex items-center gap-1.5 py-1">
      <span class="typing-dot w-2 h-2 rounded-full" style="background:var(--text-muted2)"></span>
      <span class="typing-dot w-2 h-2 rounded-full" style="background:var(--text-muted2)"></span>
      <span class="typing-dot w-2 h-2 rounded-full" style="background:var(--text-muted2)"></span>
    </div>`;
  container.appendChild(typingEl);
  scrollToBottom();

  // Prepare response
  const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

  setTimeout(async () => {
    // Remove typing indicator
    typingEl.remove();

    // Create AI message
    const msgId = uid();
    const aiMsg = { id: msgId, role: 'assistant', content: response, timestamp: Date.now() };
    session.messages.push(aiMsg);

    const aiEl = createMessageEl(aiMsg);
    container.appendChild(aiEl);

    // Typewriter
    const contentEl = aiEl.querySelector('.msg-content');
    if (contentEl) {
      await typewriter(contentEl, response, 15);
      formatCodeBlocks(contentEl);
    }

    state.isProcessing = false;
    session.updatedAt = Date.now();
    updateHeader();
    renderSessionList();
    scrollToBottom();
  }, 800 + Math.random() * 600);
}

// ═══════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════

useDataAction({
  root,
  actions: {
    newSession() {
      state.searchQuery = '';
      const searchInput = refs.searchInput;
      if (searchInput) searchInput.value = '';

      const title = `新对话 ${state.sessions.length + 1}`;
      const sess = {
        id: uid(),
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.sessions.unshift(sess);
      state.currentSessionId = sess.id;
      renderSessionList();
      renderMessages();
      updateHeader();
    },

    selectSession(ev, el) {
      const id = el.dataset.sessionId || el.closest('[data-session-id]')?.dataset.sessionId;
      if (!id || id === state.currentSessionId) return;
      state.currentSessionId = id;
      renderSessionList();
      renderMessages();
      updateHeader();
    },

    deleteSession(ev, el) {
      ev.stopPropagation();
      const id = el.dataset.sessionId || el.closest('[data-session-id]')?.dataset.sessionId;
      if (!id) return;
      const idx = state.sessions.findIndex(s => s.id === id);
      if (idx === -1) return;
      state.sessions.splice(idx, 1);

      if (state.currentSessionId === id) {
        state.currentSessionId = state.sessions.length > 0 ? state.sessions[0].id : null;
      }
      renderSessionList();
      renderMessages();
      updateHeader();
    },

    searchSession(ev, el) {
      state.searchQuery = el.value || '';
      renderSessionList();
    },

    sendMessage() {
      const input = refs.chatInput;
      if (!input || state.isProcessing) return;

      const text = input.value.trim();
      if (!text) return;

      // Find or create session
      let session = state.sessions.find(s => s.id === state.currentSessionId);
      if (!session) {
        session = {
          id: uid(),
          title: text.slice(0, 20) + (text.length > 20 ? '…' : ''),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.sessions.unshift(session);
        state.currentSessionId = session.id;
      }

      // Update title if it's a new session
      if (session.messages.length === 0 && session.title.startsWith('新对话')) {
        session.title = text.slice(0, 20) + (text.length > 20 ? '…' : '');
      }

      // User message
      const userMsg = { id: uid(), role: 'user', content: text, timestamp: Date.now() };
      session.messages.push(userMsg);
      session.updatedAt = Date.now();

      input.value = '';
      input.style.height = 'auto';

      renderMessages();
      updateHeader();
      renderSessionList();
      scrollToBottom();

      // AI reply
      simulateAiReply(text);

      // Show welcome quick btns on first message
      sessionStorage.setItem('nexus-first-msg-shown', 'true');
    },

    clearMessages() {
      const session = state.sessions.find(s => s.id === state.currentSessionId);
      if (!session || session.messages.length === 0) return;
      session.messages = [];
      renderMessages();
      updateHeader();
    },

    toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('nexus-theme', next);
    },

    quickQuestion(ev, el) {
      // Use data-question attribute when available (welcome screen),
      // otherwise fall back to visible text (inline quick buttons)
      const text = el.dataset.question || el.textContent.trim();
      if (!text) return;
      const input = refs.chatInput;
      if (input) {
        input.value = text;
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 128) + 'px';
        input.focus();
      }
      // Auto-send via the sendMessage action
      setTimeout(() => {
        const sendBtn = document.querySelector('[data-action="sendMessage"]');
        if (sendBtn) sendBtn.click();
      }, 100);
    },

    switchModel(ev, el) {
      const sel = refs.modelSelector;
      if (!sel) return;

      // Toggle existing dropdown
      const existing = sel.querySelector('.model-dropdown');
      if (existing) { existing.classList.toggle('open'); return; }

      // Build new dropdown
      const dropdown = document.createElement('div');
      dropdown.className = 'model-dropdown';

      for (const model of MODELS) {
        const isActive = model.id === state.currentModel;
        const item = document.createElement('div');
        item.className = `model-option flex items-center justify-between ${isActive ? 'active' : ''}`;
        item.dataset.modelId = model.id;
        item.innerHTML = `<span>${model.name}</span><span class="text-zinc-500 text-[10px]">${model.provider}</span>`;
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          state.currentModel = model.id;
          updateModelSelector();
          dropdown.remove();
        });
        dropdown.appendChild(item);
      }

      sel.style.position = 'relative';
      sel.appendChild(dropdown);
      requestAnimationFrame(() => dropdown.classList.add('open'));

      // Close on outside click
      const close = (e) => {
        if (!dropdown.contains(e.target) && !sel.contains(e.target)) {
          dropdown.remove();
          document.removeEventListener('click', close);
        }
      };
      setTimeout(() => document.addEventListener('click', close), 0);
    },

    voiceInput() {
      // TODO: 接入语音输入功能
      console.log('voiceInput triggered — placeholder for future implementation');
    },

    uploadFile() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf,.doc,.docx,.txt,.csv,.json,.ts,.js,.tsx,.jsx';
      input.multiple = true;
      input.className = 'hidden';
      input.addEventListener('change', () => {
        if (!input.files || input.files.length === 0) return;
        const names = Array.from(input.files).map(f => f.name).join(', ');
        // Show uploaded file as a message
        let session = state.sessions.find(s => s.id === state.currentSessionId);
        if (!session) {
          const title = `文件：${input.files[0].name.slice(0, 15)}…`;
          session = {
            id: uid(),
            title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          state.sessions.unshift(session);
          state.currentSessionId = session.id;
        }

        const fileMsg = { id: uid(), role: 'user', content: `📎 上传了文件：${names}`, timestamp: Date.now() };
        session.messages.push(fileMsg);
        session.updatedAt = Date.now();

        const container = refs.chatMessages;
        renderMessages();
        updateHeader();
        renderSessionList();
        scrollToBottom();

        simulateAiReply(fileMsg.content);
      });
      input.click();
    },

    copyMessage(ev, el) {
      // Find the message content from the parent AI message element
      const aiWrapper = el.closest('.msg-ai');
      if (!aiWrapper) return;
      const contentEl = aiWrapper.querySelector('.msg-content');
      if (!contentEl) return;

      const text = contentEl.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        const icon = el.querySelector('i');
        if (icon) {
          icon.className = 'fa-regular fa-check text-xs';
          icon.style.color = '#22c55e';
          setTimeout(() => {
            icon.className = 'fa-regular fa-copy text-xs';
            icon.style.color = '';
          }, 2000);
        }
      });
    },

    likeMessage(ev, el) {
      const icon = el.querySelector('i');
      // Toggle filled/regular thumbs-up
      const isFilled = icon.classList.contains('fa-solid');
      icon.className = isFilled ? 'fa-regular fa-thumbs-up text-xs' : 'fa-solid fa-thumbs-up text-xs';
      // If disliking was active, reset it
      const aiWrapper = el.closest('.msg-ai');
      if (aiWrapper) {
        const dislikeBtn = aiWrapper.querySelector('[data-action="dislikeMessage"] i');
        if (dislikeBtn) dislikeBtn.className = 'fa-regular fa-thumbs-down text-xs';
      }
    },

    dislikeMessage(ev, el) {
      const icon = el.querySelector('i');
      const isFilled = icon.classList.contains('fa-solid');
      icon.className = isFilled ? 'fa-regular fa-thumbs-down text-xs' : 'fa-solid fa-thumbs-down text-xs';
      // If liking was active, reset it
      const aiWrapper = el.closest('.msg-ai');
      if (aiWrapper) {
        const likeBtn = aiWrapper.querySelector('[data-action="likeMessage"] i');
        if (likeBtn) likeBtn.className = 'fa-regular fa-thumbs-up text-xs';
      }
    },
  },
});

// ═══════════════════════════════════════════════
// Init — build initial state with demo data
// ═══════════════════════════════════════════════

const DEMO_SESSION_1 = 'sess-demo-1';
const DEMO_SESSION_2 = 'sess-demo-2';
const DEMO_SESSION_3 = 'sess-demo-3';

const DEMO_SESSIONS = [
  {
    id: DEMO_SESSION_1,
    title: 'React 组件设计讨论',
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 6900000,
    messages: [
      { id: 'dm1', role: 'assistant', content: '你好！我可以帮你设计 React 组件。你目前在做什么项目？需要什么样的组件？', timestamp: Date.now() - 7200000 },
      { id: 'dm2', role: 'user', content: '我需要一个数据表格组件，支持排序、筛选和分页，用 Tailwind CSS', timestamp: Date.now() - 7100000 },
      { id: 'dm3', role: 'assistant', content: '好的，我来帮你实现一个带排序、筛选和分页功能的 DataTable 组件。\n\n核心思路是用 `useState` 管理排序和分页状态，`useMemo` 做数据派生，避免不必要的重渲染。', timestamp: Date.now() - 7000000 },
      { id: 'dm4', role: 'user', content: '不错，能加上行选择（checkbox）和导出 CSV 功能吗？', timestamp: Date.now() - 6900000 },
    ],
  },
  {
    id: DEMO_SESSION_2,
    title: 'API 接口优化方案',
    createdAt: Date.now() - 86400000 * 1.2,
    updatedAt: Date.now() - 86400000,
    messages: [
      { id: 'dm5', role: 'user', content: '我们现在的 API 响应太慢了，平均 1.2s，有什么优化方案？', timestamp: Date.now() - 86400000 * 1.2 },
      { id: 'dm6', role: 'assistant', content: '这个问题涉及到多个层面的优化。建议从这几方面入手：\n\n1. **数据库层** — 检查慢查询，加索引\n2. **缓存层** — Redis 缓存热点数据\n3. **应用层** — 用异步处理非核心逻辑\n4. **网络层** — 启用 gzip、HTTP/2\n\n先定位瓶颈在哪里再对症下药。', timestamp: Date.now() - 86400000 * 1.19 },
    ],
  },
  {
    id: DEMO_SESSION_3,
    title: '数据库表结构设计',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1.9,
    messages: [
      { id: 'dm7', role: 'user', content: '帮我设计一个电商订单系统的数据库表结构', timestamp: Date.now() - 86400000 * 2 },
      { id: 'dm8', role: 'assistant', content: '好的，电商订单系统核心表设计如下：\n\n```\nusers (id, name, email, phone)\nproducts (id, name, price, stock, category_id)\norders (id, user_id, total, status, created_at)\norder_items (id, order_id, product_id, quantity, price)\n```\n\n关键点：\n- 订单和商品拆分开，支持一个订单多个商品\n- status 用枚举管理订单状态流转\n- 加适当的索引提高查询性能', timestamp: Date.now() - 86400000 * 1.98 },
    ],
  },
];

function init() {
  // Apply saved theme
  const savedTheme = localStorage.getItem('nexus-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Load state from data
  state.sessions = DEMO_SESSIONS.map(s => ({ ...s, messages: s.messages.map(m => ({ ...m })) }));
  state.currentSessionId = DEMO_SESSION_1;

  renderSessionList();
  renderMessages();
  updateHeader();
  updateModelSelector();
}

// ─── Search: real-time filter ──────────────────

function onSearchInput() {
  const input = refs.searchInput;
  if (!input) return;
  state.searchQuery = input.value || '';
  renderSessionList();
}

// The search input fires on 'input' event, not click
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el && el.dataset && el.dataset.ref === 'searchInput') {
    onSearchInput();
  }
});

// ─── Keyboard: Enter to send ───────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    const input = refs.chatInput;
    if (input && document.activeElement === input) {
      e.preventDefault();
      const sendBtn = document.querySelector('[data-action="sendMessage"]');
      if (sendBtn) sendBtn.click();
    }
  }
});

// ─── Start ─────────────────────────────────────

init();
