import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'st_chat_widget_v1';

function nowIso() {
  return new Date().toISOString();
}

function safeTrim(s) {
  return String(s ?? '').trim();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (!Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

function saveState(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function initialMessages() {
  return [
    {
      id: 'sys-hello',
      role: 'bot',
      ts: nowIso(),
      text:
        'Здравствуйте! Я помогу связаться с менеджером. Напишите вопрос — и мы ответим как можно быстрее.',
    },
  ];
}

export default function ChatWidget() {
  const persisted = useMemo(() => loadState(), []);
  const [open, setOpen] = useState(() => Boolean(persisted?.open));
  const [messages, setMessages] = useState(() => persisted?.messages ?? initialMessages());
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const debug =
    (import.meta?.env?.DEV ?? false) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('st_chat_debug') === '1');

  useEffect(() => {
    saveState({ open, messages });
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => textareaRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  async function send(text) {
    const msg = safeTrim(text);
    if (!msg) return;
    if (sending) return;

    setError('');
    setSending(true);

    const userItem = { id: crypto.randomUUID(), role: 'user', ts: nowIso(), text: msg };
    setMessages((prev) => [...prev, userItem]);
    setDraft('');

    try {
      const payload = {
        message: msg,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      };
      if (debug) {
        console.groupCollapsed('[ChatWidget] send');
        console.debug('payload', payload);
      }
      const res = await fetch('/api/chatbot-send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        if (debug) {
          console.debug('http', res.status, res.statusText);
          console.debug('response', data);
          console.groupEnd();
        }
        const code = data?.error ? String(data.error) : `http_${res.status}`;
        throw new Error(code);
      }
      if (debug) {
        console.debug('http', res.status, res.statusText);
        console.debug('server.targetChatId', data?.targetChatId);
        console.debug('green.httpCode', data?.green?.httpCode);
        console.debug('green.messageId', data?.green?.messageId);
        console.debug('green.response', data?.green?.response);
        console.groupEnd();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          ts: nowIso(),
          text: 'Принято! Сообщение отправлено менеджеру. Если нужно — оставьте контакты (телефон/почта).',
        },
      ]);
    } catch (e) {
      const code = String(e?.message || '');
      if (code === 'rate_limited' || code.startsWith('http_429')) {
        setError('Слишком часто. Подождите пару секунд и отправьте ещё раз.');
      } else {
        setError('Не удалось отправить. Попробуйте ещё раз через минуту.');
      }
      if (debug) {
        console.debug('[ChatWidget] error', e);
        try {
          console.groupEnd();
        } catch {
          // ignore
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          ts: nowIso(),
          text:
            'Похоже, сейчас есть проблема с доставкой. Можете написать в WhatsApp/Telegram или оставить контакты на странице “Контакты”.',
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  }

  const quick = [
    'Хочу консультацию по интеграции 1С',
    'Нужен аудит/доработка Bitrix24',
    'Интересует внедрение и сроки',
  ];

  return (
    <div className="st-chat">
      <button
        type="button"
        className={`st-chat-fab ${open ? 'st-chat-fab--open' : ''}`}
        aria-label={open ? 'Закрыть чат' : 'Открыть чат'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {open ? 'close' : 'chat_bubble'}
        </span>
      </button>

      <div className={`st-chat-panel ${open ? 'st-chat-panel--open' : ''}`} role="dialog" aria-modal="false">
        <div className="st-chat-head">
          <div className="st-chat-title">
            <div className="st-chat-title-main">SINTEGRATOR</div>
            <div className="st-chat-title-sub">Онлайн-чат с менеджером</div>
          </div>
          <button type="button" className="st-icon-btn st-chat-x" onClick={() => setOpen(false)} aria-label="Закрыть">
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="st-chat-body" ref={listRef}>
          {messages.map((m) => (
            <div key={m.id} className={`st-chat-msg st-chat-msg--${m.role}`}>
              <div className="st-chat-bubble">{m.text}</div>
            </div>
          ))}
          {sending ? (
            <div className="st-chat-msg st-chat-msg--bot">
              <div className="st-chat-bubble st-chat-bubble--typing">
                <span className="st-chat-dot" />
                <span className="st-chat-dot" />
                <span className="st-chat-dot" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="st-chat-quick">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              className="st-chat-chip"
              disabled={sending}
              onClick={() => void send(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="st-chat-foot">
          <textarea
            ref={textareaRef}
            className="st-chat-input"
            placeholder="Напишите сообщение…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
          />
          <button
            type="button"
            className="st-chat-send steel-gradient"
            disabled={sending || !safeTrim(draft)}
            onClick={() => void send(draft)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              send
            </span>
          </button>
        </div>

        {error ? <div className="st-chat-error">{error}</div> : null}
      </div>
    </div>
  );
}

