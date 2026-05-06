/**
 * Отправка письма с ссылкой подтверждения (порядок попыток):
 * 1) VITE_VERIFICATION_EMAIL_ENDPOINT — ваш бэкенд (POST JSON: { to, confirmUrl })
 * 2) EmailJS — VITE_EMAILJS_PUBLIC_KEY + SERVICE_ID + TEMPLATE_ID (шаблон: to_email, confirm_url, user_name)
 */
const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send';

async function postBackend({ to, confirmUrl }) {
  const ep = import.meta.env.VITE_VERIFICATION_EMAIL_ENDPOINT;
  if (!ep || typeof ep !== 'string') return null;
  try {
    const r = await fetch(ep, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, confirmUrl }),
    });
    return { sent: r.ok, channel: 'backend' };
  } catch {
    return { sent: false, channel: 'backend' };
  }
}

async function postEmailJs({ to, confirmUrl, displayName }) {
  const userId = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  if (!userId || !serviceId || !templateId) return null;

  try {
    const r = await fetch(EMAILJS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        template_params: {
          to_email: to,
          confirm_url: confirmUrl,
          user_name: displayName || String(to).split('@')[0] || '',
        },
      }),
    });
    return { sent: r.ok, channel: 'emailjs' };
  } catch {
    return { sent: false, channel: 'emailjs' };
  }
}

export async function notifyVerificationEmail({ to, confirmUrl, displayName = '' }) {
  const backend = await postBackend({ to, confirmUrl });
  if (backend) return backend;

  const emailJs = await postEmailJs({ to, confirmUrl, displayName });
  if (emailJs) return emailJs;

  return { sent: false, channel: 'none' };
}
