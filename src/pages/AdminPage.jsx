import { useMemo, useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext.jsx';

const ADMIN_SESSION_KEY = 'sintegrator.admin.session';
const ADMIN_SETTINGS_KEY = 'sintegrator.admin.settings';
const CHAT_WIDGET_STORAGE_KEY = 'st_chat_widget_v1';
const ADMIN_CHAT_TEST_LOG_KEY = 'sintegrator.admin.chatTestLog.v1';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readChatWidgetState() {
  try {
    const raw = localStorage.getItem(CHAT_WIDGET_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (!Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

function clearChatWidgetState() {
  try {
    localStorage.removeItem(CHAT_WIDGET_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function readChatTestLog() {
  try {
    const raw = localStorage.getItem(ADMIN_CHAT_TEST_LOG_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeChatTestLog(items) {
  try {
    localStorage.setItem(ADMIN_CHAT_TEST_LOG_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function readAdminSession() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function setAdminSession(enabled) {
  try {
    if (enabled) sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function buildTestConfirmUrl(token) {
  const url = new URL('/verify-email', window.location.origin);
  url.searchParams.set('token', token);
  return url.toString();
}

function getDefaultSettings() {
  return {
    mailEndpoint:
      import.meta.env.VITE_VERIFICATION_EMAIL_ENDPOINT || '/api/send-verification.php',
    mailTo: '',
    chatEndpoint: import.meta.env.VITE_CHATBOT_ENDPOINT || '/api/chatbot-send.php',
    chatToChatId: '',
    chatMessage: '',
    chatPageUrl: '',
  };
}

function normalizeSettings(raw) {
  const base = getDefaultSettings();
  if (!raw || typeof raw !== 'object') return base;
  return {
    mailEndpoint: typeof raw.mailEndpoint === 'string' ? raw.mailEndpoint : base.mailEndpoint,
    mailTo: typeof raw.mailTo === 'string' ? raw.mailTo : base.mailTo,
    chatEndpoint: typeof raw.chatEndpoint === 'string' ? raw.chatEndpoint : base.chatEndpoint,
    chatToChatId: typeof raw.chatToChatId === 'string' ? raw.chatToChatId : base.chatToChatId,
    chatMessage: typeof raw.chatMessage === 'string' ? raw.chatMessage : base.chatMessage,
    chatPageUrl: typeof raw.chatPageUrl === 'string' ? raw.chatPageUrl : base.chatPageUrl,
  };
}

export default function AdminPage() {
  const { lang } = usePreferences();
  const [authed, setAuthed] = useState(() => readAdminSession());
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('settings');
  const [settingsTab, setSettingsTab] = useState('mail');
  const [settings, setSettings] = useState(() =>
    normalizeSettings(readJson(ADMIN_SETTINGS_KEY, null)),
  );
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(null);
  const [chatTestView, setChatTestView] = useState('message'); // message | history
  const [chatAdminKey, setChatAdminKey] = useState(() => readJson('sintegrator.admin.chatAdminKey', ''));
  const [chatManagerId, setChatManagerId] = useState(() => readJson('sintegrator.admin.chatManagerId', ''));
  const [chatClientId, setChatClientId] = useState(() => readJson('sintegrator.admin.chatClientId', ''));
  const [chatHistCount, setChatHistCount] = useState(() => readJson('sintegrator.admin.chatHistCount', 50));
  const [chatHistoryRemote, setChatHistoryRemote] = useState(null);
  const [chatHistoryPending, setChatHistoryPending] = useState(false);

  const confirmUrl = useMemo(
    () => buildTestConfirmUrl(`test-${crypto.randomUUID()}`),
    [],
  );

  function parseJsonMaybe(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function humanizeResult(r) {
    if (!r) return '';
    const parsed = typeof r.body === 'string' ? parseJsonMaybe(r.body) : null;
    const status = r.status || 0;
    const ok = r.ok === true;
    const isJson = parsed && typeof parsed === 'object';
    const apiOk = isJson ? parsed.ok === true : null;
    const endpointHint =
      settingsTab === 'mail'
        ? settings.mailEndpoint
        : settingsTab === 'chat'
          ? settings.chatEndpoint
          : '';

    const lines = [];
    lines.push(ok ? '✅ Успех' : '⛔ Ошибка');
    lines.push(`HTTP: ${status}${r.statusText ? ` (${r.statusText})` : ''}`);
    if (endpointHint) lines.push(`Endpoint: ${endpointHint}`);

    if (typeof r.body === 'string' && r.body.includes('<?php')) {
      lines.push('');
      lines.push('⚠️ PHP НЕ исполняется (Vite dev-server отдал файл как текст).');
      lines.push('Нужно запустить PHP-сервер и настроить прокси /api в vite.config.js.');
    }

    if (isJson) {
      if (typeof parsed.error === 'string' && parsed.error) lines.push(`Code: ${parsed.error}`);
      if (apiOk === true) lines.push('API: ok=true');
      if (apiOk === false) lines.push('API: ok=false');

      if (typeof parsed.targetChatId === 'string' && parsed.targetChatId) {
        lines.push(`To: ${parsed.targetChatId}`);
      }
      const messageId = parsed?.green?.messageId;
      if (typeof messageId === 'string' && messageId) {
        lines.push(`MessageId: ${messageId}`);
      }
      const greenHttp = parsed?.green?.httpCode;
      if (typeof greenHttp === 'number') lines.push(`GREEN-API HTTP: ${greenHttp}`);
    }

    return lines.join('\n');
  }

  function normalizeChatIdInput(raw) {
    const s = String(raw || '').trim();
    if (!s) return '';
    if (s.includes('@')) return s;
    const digits = s.replace(/\D+/g, '');
    if (!digits) return '';
    return `${digits}@c.us`;
  }

  const ui =
    lang === 'ru'
      ? {
          title: 'Админ-панель',
          lead:
            'Временная админка (логин/пароль задаются в .env). После входа доступны настройки и тестирование почты и чата.',
          authTitle: 'Авторизация',
          login: 'Логин',
          password: 'Пароль',
          enter: 'Войти',
          logout: 'Выйти',
          errEnv: 'Не задан VITE_ADMIN_LOGIN / VITE_ADMIN_PASSWORD в окружении.',
          errInvalid: 'Неверный логин или пароль.',
          tabSettings: 'Настройка',
          tabChatLog: 'История чата',
          subMail: 'Почта',
          subChat: 'Чат',
          logTitle: 'Переписка (локально в браузере)',
          logEmpty: 'История чата пока пустая (или вы открыли админку в другом браузере/устройстве).',
          logCounts: 'Счётчики',
          logUserMsgs: 'Сообщений от пользователя',
          logBotMsgs: 'Сообщений от бота',
          logTotal: 'Всего сообщений',
          logLast: 'Последнее сообщение',
          logClear: 'Очистить историю чата',
          logExport: 'Экспорт JSON (копировать)',
          mailEndpoint: 'Эндпоинт отправки письма',
          mailTo: 'Email получателя',
          mailConfirmUrl: 'Confirm URL (будет в письме)',
          mailSend: 'Отправить тестовое письмо',
          chatEndpoint: 'Эндпоинт отправки в чат',
          chatToChatId: 'MAX chatId / телефон получателя (только для теста). Если телефон — вводите цифры, сервер сам добавит @c.us',
          chatMessage: 'Сообщение',
          chatMessageTab: 'Сообщение',
          chatHistoryTab: 'История переписки',
          chatSettingsTab: 'Настройки',
          chatHistoryEmpty: 'Пока нет тестовых сообщений.',
          chatHistoryClear: 'Очистить историю',
          chatAdminKey: 'Admin key (для серверных операций)',
          chatManagerId: 'Номер/ChatId менеджера (куда слать ВСЕ сообщения с сайта)',
          chatSettingsSave: 'Сохранить',
          chatSettingsLoad: 'Загрузить',
          chatClientId: 'ChatId клиента для просмотра переписки (например 7999...@c.us)',
          chatHistCount: 'Сколько сообщений показать',
          chatHistRefresh: 'Обновить переписку',
          chatHistEmptyRemote: 'Нет сообщений (или ещё не подтянулись в журнал).',
          chatPageUrl: 'URL страницы (опционально)',
          chatSend: 'Отправить тест в чат',
          sending: 'Отправляем…',
          result: 'Result',
          note:
            'Важно: это клиентская “проверка” (не серверная защита). Для настоящей защиты нужно закрывать доступ на уровне сервера.',
        }
      : {
          title: 'Admin panel',
          lead:
            'Temporary admin UI (login/password are set in .env). After sign-in you can configure and test email and chat.',
          authTitle: 'Sign in',
          login: 'Login',
          password: 'Password',
          enter: 'Sign in',
          logout: 'Sign out',
          errEnv: 'Missing VITE_ADMIN_LOGIN / VITE_ADMIN_PASSWORD in env.',
          errInvalid: 'Invalid login or password.',
          tabSettings: 'Settings',
          tabChatLog: 'Chat log',
          subMail: 'Email',
          subChat: 'Chat',
          logTitle: 'Conversation (local in browser)',
          logEmpty: 'Chat history is empty (or you opened admin in another browser/device).',
          logCounts: 'Counters',
          logUserMsgs: 'User messages',
          logBotMsgs: 'Bot messages',
          logTotal: 'Total messages',
          logLast: 'Last message',
          logClear: 'Clear chat history',
          logExport: 'Export JSON (copy)',
          mailEndpoint: 'Email endpoint',
          mailTo: 'Recipient email',
          mailConfirmUrl: 'Confirm URL (in email)',
          mailSend: 'Send test email',
          chatEndpoint: 'Chat endpoint',
          chatToChatId: 'Recipient MAX chatId / phone (test only). If phone, enter digits — server will append @c.us',
          chatMessage: 'Message',
          chatHistory: 'History',
          chatMessageTab: 'Message',
          chatHistoryTab: 'Conversation history',
          chatSettingsTab: 'Settings',
          chatHistoryEmpty: 'No test messages yet.',
          chatHistoryClear: 'Clear history',
          chatAdminKey: 'Admin key (for server operations)',
          chatManagerId: 'Manager chatId (default destination for ALL site messages)',
          chatSettingsSave: 'Save',
          chatSettingsLoad: 'Load',
          chatClientId: 'Client chatId to view conversation (e.g. 7999...@c.us)',
          chatHistCount: 'Messages to show',
          chatHistRefresh: 'Refresh conversation',
          chatHistEmptyRemote: 'No messages (or not yet appeared in journal).',
          chatPageUrl: 'Page URL (optional)',
          chatSend: 'Send chat test',
          sending: 'Sending…',
          result: 'Result',
          note:
            'Note: this is client-side gating (not server security). For real protection, lock access on the server.',
        };

  function persist(next) {
    setSettings(next);
    writeJson(ADMIN_SETTINGS_KEY, next);
  }

  function doLogin(e) {
    e.preventDefault();
    setError('');
    const envLogin = import.meta.env.VITE_ADMIN_LOGIN;
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!envLogin || !envPass) {
      setError(ui.errEnv);
      return;
    }
    const ok =
      String(login).trim() === String(envLogin) &&
      String(password) === String(envPass);
    if (!ok) {
      setError(ui.errInvalid);
      return;
    }
    setAdminSession(true);
    setAuthed(true);
    setLogin('');
    setPassword('');
  }

  async function runMailTest() {
    setPending(true);
    setResult(null);
    try {
      const r = await fetch(settings.mailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: settings.mailTo, confirmUrl }),
      });
      const text = await r.text();
      setResult({ ok: r.ok, status: r.status, statusText: r.statusText, body: text });
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: 'Network error',
        body: String(e?.message || e),
      });
    } finally {
      setPending(false);
    }
  }

  async function runChatTest() {
    setPending(true);
    setResult(null);
    try {
      const r = await fetch(settings.chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toChatId: settings.chatToChatId,
          message: settings.chatMessage,
          pageUrl: settings.chatPageUrl,
        }),
      });
      const text = await r.text();
      const next = { ok: r.ok, status: r.status, statusText: r.statusText, body: text };
      setResult(next);
      const parsed = parseJsonMaybe(text);
      const entry = {
        ts: new Date().toISOString(),
        endpoint: settings.chatEndpoint,
        to: settings.chatToChatId,
        message: settings.chatMessage,
        pageUrl: settings.chatPageUrl,
        ok: r.ok === true && parsed?.ok === true,
        http: r.status,
        code: typeof parsed?.error === 'string' ? parsed.error : '',
        targetChatId: typeof parsed?.targetChatId === 'string' ? parsed.targetChatId : '',
        messageId: typeof parsed?.green?.messageId === 'string' ? parsed.green.messageId : '',
      };
      const prev = readChatTestLog();
      const trimmed = [entry, ...prev].slice(0, 200);
      writeChatTestLog(trimmed);
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: 'Network error',
        body: String(e?.message || e),
      });
    } finally {
      setPending(false);
    }
  }

  async function loadChatbotSettings() {
    setChatHistoryPending(true);
    setResult(null);
    try {
      const r = await fetch('/api/chatbot-settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: chatAdminKey }),
      });
      const text = await r.text();
      const parsed = parseJsonMaybe(text);
      if (parsed?.ok === true && typeof parsed.managerChatId === 'string') {
        setChatManagerId(parsed.managerChatId);
        writeJson('sintegrator.admin.chatManagerId', parsed.managerChatId);
      }
      setResult({ ok: r.ok, status: r.status, statusText: r.statusText, body: text });
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: 'Network error',
        body: String(e?.message || e),
      });
    } finally {
      setChatHistoryPending(false);
    }
  }

  async function saveChatbotSettings() {
    setChatHistoryPending(true);
    setResult(null);
    try {
      const r = await fetch('/api/chatbot-settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: chatAdminKey, managerChatId: chatManagerId }),
      });
      const text = await r.text();
      setResult({ ok: r.ok, status: r.status, statusText: r.statusText, body: text });
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: 'Network error',
        body: String(e?.message || e),
      });
    } finally {
      setChatHistoryPending(false);
    }
  }

  async function refreshRemoteConversation() {
    setChatHistoryPending(true);
    setResult(null);
    setChatHistoryRemote(null);
    try {
      const r = await fetch('/api/chatbot-history.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminKey: chatAdminKey,
          chatId: chatClientId,
          count: Number(chatHistCount) || 50,
        }),
      });
      const text = await r.text();
      const parsed = parseJsonMaybe(text);
      if (parsed?.ok === true) setChatHistoryRemote(parsed);
      setResult({ ok: r.ok, status: r.status, statusText: r.statusText, body: text });
    } catch (e) {
      setResult({
        ok: false,
        status: 0,
        statusText: 'Network error',
        body: String(e?.message || e),
      });
    } finally {
      setChatHistoryPending(false);
    }
  }

  if (!authed) {
    return (
      <div className="st-container" style={{ paddingBlock: '2.5rem' }}>
        <div
          className="milled-surface"
          style={{ padding: '2rem', maxWidth: '760px', margin: '0 auto' }}
        >
          <h1 className="st-display st-display-sm" style={{ marginTop: 0 }}>
            {ui.title}
          </h1>
          <p className="st-text-muted" style={{ marginTop: '0.75rem' }}>
            {ui.lead}
          </p>
          <p className="st-text-muted" style={{ marginTop: '0.75rem' }}>
            {ui.note}
          </p>

          <h2 className="st-h3" style={{ marginTop: '2rem' }}>
            {ui.authTitle}
          </h2>

          <form
            onSubmit={doLogin}
            style={{ marginTop: '1.25rem', display: 'grid', gap: '1.25rem' }}
          >
            <label>
              <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                {ui.login}
              </span>
              <input
                className="st-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label>
              <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                {ui.password}
              </span>
              <input
                className="st-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
              />
            </label>

            {error ? (
              <p className="st-auth-error" style={{ margin: 0 }}>
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="st-btn-head steel-gradient"
              disabled={!login || !password}
              style={{ justifySelf: 'start' }}
            >
              {ui.enter}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="st-container" style={{ paddingBlock: '2.5rem' }}>
      <div className="milled-surface" style={{ padding: '2rem', maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <div>
            <h1 className="st-display st-display-sm" style={{ marginTop: 0 }}>
              {ui.title}
            </h1>
            <p className="st-text-muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
              {ui.lead}
            </p>
          </div>
          <button
            type="button"
            className="st-btn-head steel-gradient"
            onClick={() => {
              setAdminSession(false);
              setAuthed(false);
              setResult(null);
              setError('');
            }}
            style={{ whiteSpace: 'nowrap' }}
          >
            {ui.logout}
          </button>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`st-auth-tab${tab === 'settings' ? ' st-auth-tab--active' : ''}`.trim()}
            onClick={() => setTab('settings')}
          >
            {ui.tabSettings}
          </button>
          <button
            type="button"
            className={`st-auth-tab${tab === 'chatlog' ? ' st-auth-tab--active' : ''}`.trim()}
            onClick={() => {
              setTab('chatlog');
              setResult(null);
            }}
          >
            {ui.tabChatLog}
          </button>
        </div>

        {tab === 'settings' ? (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`st-auth-tab${settingsTab === 'mail' ? ' st-auth-tab--active' : ''}`.trim()}
                onClick={() => {
                  setSettingsTab('mail');
                  setResult(null);
                }}
              >
                {ui.subMail}
              </button>
              <button
                type="button"
                className={`st-auth-tab${settingsTab === 'chat' ? ' st-auth-tab--active' : ''}`.trim()}
                onClick={() => {
                  setSettingsTab('chat');
                  setResult(null);
                }}
              >
                {ui.subChat}
              </button>
            </div>

            {settingsTab === 'mail' ? (
              <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.25rem' }}>
                <label>
                  <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                    {ui.mailEndpoint}
                  </span>
                  <input
                    className="st-input"
                    value={settings.mailEndpoint}
                    onChange={(e) => persist({ ...settings, mailEndpoint: e.target.value })}
                  />
                </label>
                <label>
                  <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                    {ui.mailTo}
                  </span>
                  <input
                    className="st-input"
                    value={settings.mailTo}
                    onChange={(e) => persist({ ...settings, mailTo: e.target.value })}
                    placeholder="user@example.com"
                  />
                </label>
                <label>
                  <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                    {ui.mailConfirmUrl}
                  </span>
                  <input className="st-input" value={confirmUrl} readOnly />
                </label>
                <button
                  type="button"
                  className="st-btn-head steel-gradient"
                  disabled={!settings.mailTo || pending}
                  onClick={runMailTest}
                  style={{ justifySelf: 'start' }}
                >
                  {pending ? ui.sending : ui.mailSend}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className={`st-auth-tab${chatTestView === 'message' ? ' st-auth-tab--active' : ''}`.trim()}
                    onClick={() => setChatTestView('message')}
                  >
                    {ui.chatMessageTab}
                  </button>
                  <button
                    type="button"
                    className={`st-auth-tab${chatTestView === 'history' ? ' st-auth-tab--active' : ''}`.trim()}
                    onClick={() => setChatTestView('history')}
                  >
                    {ui.chatHistoryTab}
                  </button>
                  <button
                    type="button"
                    className={`st-auth-tab${chatTestView === 'settings' ? ' st-auth-tab--active' : ''}`.trim()}
                    onClick={() => setChatTestView('settings')}
                  >
                    {ui.chatSettingsTab}
                  </button>
                </div>

                {chatTestView === 'message' ? (
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatEndpoint}
                      </span>
                      <input
                        className="st-input"
                        value={settings.chatEndpoint}
                        onChange={(e) => persist({ ...settings, chatEndpoint: e.target.value })}
                      />
                    </label>
                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatToChatId}
                      </span>
                      <input
                        className="st-input"
                        value={settings.chatToChatId}
                        onChange={(e) => persist({ ...settings, chatToChatId: e.target.value })}
                        onBlur={() => {
                          const next = normalizeChatIdInput(settings.chatToChatId);
                          if (next && next !== settings.chatToChatId) {
                            persist({ ...settings, chatToChatId: next });
                          }
                        }}
                        placeholder="79991234567 or 79991234567@c.us"
                      />
                    </label>
                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatMessage}
                      </span>
                      <textarea
                        className="st-input"
                        value={settings.chatMessage}
                        onChange={(e) => persist({ ...settings, chatMessage: e.target.value })}
                        rows={5}
                        placeholder={lang === 'ru' ? 'Тестовое сообщение…' : 'Test message…'}
                      />
                    </label>
                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatPageUrl}
                      </span>
                      <input
                        className="st-input"
                        value={settings.chatPageUrl}
                        onChange={(e) => persist({ ...settings, chatPageUrl: e.target.value })}
                        placeholder="https://example.com/page"
                      />
                    </label>
                    <button
                      type="button"
                      className="st-btn-head steel-gradient"
                      disabled={!settings.chatMessage || pending}
                      onClick={runChatTest}
                      style={{ justifySelf: 'start' }}
                    >
                      {pending ? ui.sending : ui.chatSend}
                    </button>
                  </div>
                ) : chatTestView === 'history' ? (
                  <div>
                    {(() => {
                      const items = readChatTestLog();
                      return (
                        <>
                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <button
                              type="button"
                              className="st-btn-head steel-gradient"
                              disabled={items.length === 0}
                              onClick={() => {
                                writeChatTestLog([]);
                                setResult({
                                  ok: true,
                                  status: 200,
                                  statusText: 'Cleared',
                                  body: JSON.stringify({ ok: true, cleared: true }),
                                });
                              }}
                            >
                              {ui.chatHistoryClear}
                            </button>
                          </div>

                          {items.length === 0 ? (
                            <p className="st-text-muted" style={{ marginTop: 0 }}>
                              {ui.chatHistoryEmpty}
                            </p>
                          ) : (
                            <pre
                              style={{
                                margin: 0,
                                padding: '1rem 1.25rem',
                                background: 'rgba(15, 23, 42, 0.08)',
                                border: '1px solid rgba(148, 163, 184, 0.35)',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                maxHeight: '420px',
                                overflow: 'auto',
                              }}
                            >
                              {items
                                .map((it) => {
                                  const ok = it?.ok ? 'OK' : 'FAIL';
                                  const ts = it?.ts || '';
                                  const to = it?.targetChatId || it?.to || '';
                                  const msgId = it?.messageId ? ` | id=${it.messageId}` : '';
                                  const code = it?.code ? ` | code=${it.code}` : '';
                                  const http = typeof it?.http === 'number' ? ` | http=${it.http}` : '';
                                  const msg = it?.message || '';
                                  return `[${ok}] ${ts} | to=${to}${http}${code}${msgId}\n${msg}\n`;
                                })
                                .join('\n')}
                            </pre>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1.25rem' }}>
                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatAdminKey}
                      </span>
                      <input
                        className="st-input"
                        value={chatAdminKey}
                        onChange={(e) => {
                          setChatAdminKey(e.target.value);
                          writeJson('sintegrator.admin.chatAdminKey', e.target.value);
                        }}
                        placeholder="(секретный ключ из chatbot.secret.php)"
                      />
                    </label>

                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatManagerId}
                      </span>
                      <input
                        className="st-input"
                        value={chatManagerId}
                        onChange={(e) => {
                          setChatManagerId(e.target.value);
                          writeJson('sintegrator.admin.chatManagerId', e.target.value);
                        }}
                        onBlur={() => {
                          const next = normalizeChatIdInput(chatManagerId);
                          if (next && next !== chatManagerId) {
                            setChatManagerId(next);
                            writeJson('sintegrator.admin.chatManagerId', next);
                          }
                        }}
                        placeholder="10000000 or 79991234567@c.us"
                      />
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="st-btn-head steel-gradient"
                        disabled={!chatAdminKey || chatHistoryPending}
                        onClick={loadChatbotSettings}
                        style={{ justifySelf: 'start' }}
                      >
                        {ui.chatSettingsLoad}
                      </button>
                      <button
                        type="button"
                        className="st-btn-head steel-gradient"
                        disabled={!chatAdminKey || !chatManagerId || chatHistoryPending}
                        onClick={saveChatbotSettings}
                        style={{ justifySelf: 'start' }}
                      >
                        {ui.chatSettingsSave}
                      </button>
                    </div>

                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatClientId}
                      </span>
                      <input
                        className="st-input"
                        value={chatClientId}
                        onChange={(e) => {
                          setChatClientId(e.target.value);
                          writeJson('sintegrator.admin.chatClientId', e.target.value);
                        }}
                        onBlur={() => {
                          const next = normalizeChatIdInput(chatClientId);
                          if (next && next !== chatClientId) {
                            setChatClientId(next);
                            writeJson('sintegrator.admin.chatClientId', next);
                          }
                        }}
                        placeholder="79991234567@c.us"
                      />
                    </label>

                    <label>
                      <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                        {ui.chatHistCount}
                      </span>
                      <input
                        className="st-input"
                        value={String(chatHistCount)}
                        onChange={(e) => {
                          const v = Number(e.target.value) || 50;
                          setChatHistCount(v);
                          writeJson('sintegrator.admin.chatHistCount', v);
                        }}
                        inputMode="numeric"
                      />
                    </label>

                    <button
                      type="button"
                      className="st-btn-head steel-gradient"
                      disabled={!chatAdminKey || !chatClientId || chatHistoryPending}
                      onClick={refreshRemoteConversation}
                      style={{ justifySelf: 'start' }}
                    >
                      {chatHistoryPending ? ui.sending : ui.chatHistRefresh}
                    </button>

                    {chatHistoryRemote?.messages?.length ? (
                      <pre
                        style={{
                          margin: 0,
                          padding: '1rem 1.25rem',
                          background: 'rgba(15, 23, 42, 0.08)',
                          border: '1px solid rgba(148, 163, 184, 0.35)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          maxHeight: '420px',
                          overflow: 'auto',
                        }}
                      >
                        {chatHistoryRemote.messages
                          .slice()
                          .reverse()
                          .map((m) => {
                            const dir = m?.type === 'outgoing' ? 'MANAGER → CLIENT' : 'CLIENT → MANAGER';
                            const ts = m?.timestamp ? new Date(m.timestamp * 1000).toISOString() : '';
                            const text = m?.text || '';
                            return `[${dir}] ${ts}\n${text}\n`;
                          })
                          .join('\n')}
                      </pre>
                    ) : (
                      <p className="st-text-muted" style={{ marginTop: 0 }}>
                        {ui.chatHistEmptyRemote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {result ? (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                  {ui.result}
                </div>
                <pre
                  style={{
                    margin: 0,
                    marginBottom: '0.75rem',
                    padding: '0.85rem 1.05rem',
                    background: 'rgba(84, 95, 115, 0.08)',
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {humanizeResult(result)}
                </pre>
                <pre
                  style={{
                    margin: 0,
                    padding: '1rem 1.25rem',
                    background: 'rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === 'chatlog' ? (
          <div style={{ marginTop: '1.5rem' }}>
            <div className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
              {ui.logTitle}
            </div>

            {(() => {
              const state = readChatWidgetState();
              const msgs = state?.messages || [];
              const userCount = msgs.filter((m) => m?.role === 'user').length;
              const botCount = msgs.filter((m) => m?.role === 'bot').length;
              const last = msgs.length ? msgs[msgs.length - 1] : null;
              const lastText = typeof last?.text === 'string' ? last.text : '';

              return (
                <>
                  {msgs.length === 0 ? (
                    <p className="st-text-muted" style={{ marginTop: 0 }}>
                      {ui.logEmpty}
                    </p>
                  ) : null}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div className="glass-panel" style={{ padding: '0.9rem' }}>
                      <div className="st-eyebrow" style={{ marginBottom: '0.5rem' }}>
                        {ui.logCounts}
                      </div>
                      <div style={{ display: 'grid', gap: '0.35rem' }}>
                        <div>
                          <strong>{ui.logUserMsgs}:</strong> {userCount}
                        </div>
                        <div>
                          <strong>{ui.logBotMsgs}:</strong> {botCount}
                        </div>
                        <div>
                          <strong>{ui.logTotal}:</strong> {msgs.length}
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '0.9rem' }}>
                      <div className="st-eyebrow" style={{ marginBottom: '0.5rem' }}>
                        {ui.logLast}
                      </div>
                      <div className="st-text-muted" style={{ fontSize: '0.9rem' }}>
                        {lastText ? lastText : '—'}
                      </div>
                    </div>
                  </div>

                  {msgs.length ? (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <button
                        type="button"
                        className="st-btn-head steel-gradient"
                        onClick={() => {
                          clearChatWidgetState();
                          setResult({
                            ok: true,
                            status: 200,
                            statusText: 'Cleared',
                            body: JSON.stringify({ ok: true, cleared: true }),
                          });
                        }}
                      >
                        {ui.logClear}
                      </button>
                      <button
                        type="button"
                        className="st-btn-head steel-gradient"
                        onClick={() => {
                          const payload = JSON.stringify(state, null, 2);
                          try {
                            navigator.clipboard?.writeText(payload);
                            setResult({
                              ok: true,
                              status: 200,
                              statusText: 'Copied',
                              body: JSON.stringify({ ok: true, copied: true }),
                            });
                          } catch {
                            setResult({
                              ok: true,
                              status: 200,
                              statusText: 'Export',
                              body: payload,
                            });
                          }
                        }}
                      >
                        {ui.logExport}
                      </button>
                    </div>
                  ) : null}

                  {msgs.length ? (
                    <pre
                      style={{
                        margin: 0,
                        padding: '1rem 1.25rem',
                        background: 'rgba(15, 23, 42, 0.08)',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '420px',
                        overflow: 'auto',
                      }}
                    >
                      {msgs
                        .map((m) => {
                          const role = m?.role === 'user' ? 'USER' : 'BOT';
                          const ts = typeof m?.ts === 'string' ? m.ts : '';
                          const text = typeof m?.text === 'string' ? m.text : '';
                          return `[${role}] ${ts}\n${text}\n`;
                        })
                        .join('\n')}
                    </pre>
                  ) : null}
                </>
              );
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
}

