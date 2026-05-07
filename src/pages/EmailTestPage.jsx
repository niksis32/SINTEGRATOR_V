import { useMemo, useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext.jsx';

function buildTestConfirmUrl(token) {
  const url = new URL('/verify-email', window.location.origin);
  url.searchParams.set('token', token);
  return url.toString();
}

export default function EmailTestPage() {
  const { lang } = usePreferences();
  const [to, setTo] = useState('');
  const [endpoint, setEndpoint] = useState(
    () => import.meta.env.VITE_VERIFICATION_EMAIL_ENDPOINT || '/api/send-verification.php',
  );
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(null);

  const confirmUrl = useMemo(() => buildTestConfirmUrl(`test-${crypto.randomUUID()}`), []);

  const ui = lang === 'ru'
    ? {
        title: 'Тест отправки письма',
        lead:
          'Страница для диагностики: вызывает ваш PHP-эндпоинт и показывает HTTP-статус + ответ. Письмо должно прийти на указанный адрес.',
        endpoint: 'Эндпоинт',
        to: 'Email получателя',
        confirmUrl: 'Confirm URL (будет в письме)',
        send: 'Отправить тестовое письмо',
        sending: 'Отправляем…',
        hint:
          'Если ответ содержит smtp_* — это уже ошибка SMTP на сервере. Если 404 — файл не выложен в public_html/api. Если CORS/Network error — проблема в доступности/SSL.',
      }
    : {
        title: 'Email sending test',
        lead: 'Diagnostics page: calls the PHP endpoint and shows status + response.',
        endpoint: 'Endpoint',
        to: 'Recipient email',
        confirmUrl: 'Confirm URL (in email)',
        send: 'Send test email',
        sending: 'Sending…',
        hint:
          'If response contains smtp_* — SMTP failed on server. If 404 — endpoint not deployed. If Network error — connectivity/SSL issue.',
      };

  async function runTest() {
    setPending(true);
    setResult(null);
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, confirmUrl }),
      });
      const text = await r.text();
      setResult({ ok: r.ok, status: r.status, statusText: r.statusText, body: text });
    } catch (e) {
      setResult({ ok: false, status: 0, statusText: 'Network error', body: String(e?.message || e) });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="st-container" style={{ paddingBlock: '2.5rem' }}>
      <div className="milled-surface" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="st-display st-display-sm" style={{ marginTop: 0 }}>
          {ui.title}
        </h1>
        <p className="st-text-muted" style={{ marginTop: '0.75rem' }}>
          {ui.lead}
        </p>

        <div style={{ marginTop: '2rem', display: 'grid', gap: '1.25rem' }}>
          <label>
            <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
              {ui.endpoint}
            </span>
            <input className="st-input" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
          </label>

          <label>
            <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
              {ui.to}
            </span>
            <input
              className="st-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="user@example.com"
            />
          </label>

          <label>
            <span className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
              {ui.confirmUrl}
            </span>
            <input className="st-input" value={confirmUrl} readOnly />
          </label>

          <button
            type="button"
            className="st-btn-head steel-gradient"
            disabled={!to || pending}
            onClick={runTest}
            style={{ justifySelf: 'start' }}
          >
            {pending ? ui.sending : ui.send}
          </button>

          <p className="st-text-muted" style={{ margin: 0 }}>
            {ui.hint}
          </p>

          {result ? (
            <div style={{ marginTop: '0.5rem' }}>
              <div className="st-eyebrow" style={{ marginBottom: '0.75rem' }}>
                Result
              </div>
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
      </div>
    </div>
  );
}

