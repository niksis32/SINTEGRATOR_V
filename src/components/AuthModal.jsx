import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePreferences } from '../contexts/PreferencesContext.jsx';
import MaterialIcon from './MaterialIcon.jsx';

const copy = {
  ru: {
    titleLogin: 'Вход',
    titleRegister: 'Регистрация',
    tabLogin: 'Войти',
    tabRegister: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    passwordAgain: 'Повторите пароль',
    name: 'Имя',
    submitLogin: 'Войти',
    submitRegister: 'Создать аккаунт',
    close: 'Закрыть',
    errInvalid: 'Неверный email или пароль.',
    errExists: 'Этот email уже зарегистрирован.',
    errMismatch: 'Пароли не совпадают.',
    errShort: 'Пароль не короче 6 символов.',
    errEmail: 'Укажите корректный email.',
    errUnverified:
      'Сначала подтвердите аккаунт: перейдите по ссылке из письма. Не пришло письмо — нажмите «Отправить ссылку снова».',
    checkTitle: 'Проверьте почту',
    checkTitleNoMail: 'Подтвердите email',
    checkLead: 'Мы отправили письмо на',
    checkLeadNoMail: 'Аккаунт создан для',
    checkHint:
      'Перейдите по ссылке в письме — только после этого вход станет доступен. Если письма нет, проверьте папку «Спам».',
    checkHintLinkOnly:
      'Подтвердите аккаунт по ссылке ниже — до этого вход с паролем будет недоступен.',
    checkEmailNotSentShort:
      'Письмо на почту сейчас не отправляется автоматически. Нажмите «Открыть подтверждение» или скопируйте ссылку. Чтобы письма уходили сами, администратору сайта нужно настроить отправку — см. блок ниже.',
    adminSetupSummary: 'Настройка почты для администратора',
    adminSetupP1:
      'В корне проекта файл .env (образец — .env.example). Вариант EmailJS: VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID. Шаблон письма: to_email, confirm_url, user_name. Сайт: emailjs.com. После правок .env перезапустите dev-сервер или пересоберите проект.',
    adminSetupP2:
      'Вариант своего сервера: VITE_VERIFICATION_EMAIL_ENDPOINT — POST, JSON { "to", "confirmUrl" }. В кабинете EmailJS ограничьте публичный ключ вашим доменом.',
    copyLink: 'Скопировать ссылку',
    copied: 'Скопировано',
    openLink: 'Открыть подтверждение',
    backToForm: 'Назад к форме',
    resend: 'Отправить ссылку снова',
    resendOk: 'Новая ссылка отправлена на почту.',
    resendOkNoMail: 'Ссылка обновлена, но письмо не отправлено — настройте .env (EmailJS или API) и нажмите снова. Пока откройте или скопируйте ссылку ниже.',
    resendFail: 'Не удалось обновить ссылку. Попробуйте позже.',
    toLoginTab: 'Уже подтвердили? Войти',
  },
  en: {
    titleLogin: 'Sign in',
    titleRegister: 'Create account',
    tabLogin: 'Sign in',
    tabRegister: 'Register',
    email: 'Email',
    password: 'Password',
    passwordAgain: 'Confirm password',
    name: 'Display name',
    submitLogin: 'Sign in',
    submitRegister: 'Create account',
    close: 'Close',
    errInvalid: 'Invalid email or password.',
    errExists: 'This email is already registered.',
    errMismatch: 'Passwords do not match.',
    errShort: 'Password must be at least 6 characters.',
    errEmail: 'Please enter a valid email.',
    errUnverified:
      'Please confirm your account using the link we emailed. If you did not receive it, click “Resend link”.',
    checkTitle: 'Check your inbox',
    checkTitleNoMail: 'Confirm your email',
    checkLead: 'We sent a message to',
    checkLeadNoMail: 'Your account was created for',
    checkHint:
      'Open the link in the email — only then you can sign in. If you do not see it, check your spam folder.',
    checkHintLinkOnly: 'Confirm your account using the link below — sign-in stays locked until you do.',
    checkEmailNotSentShort:
      'No automatic email was sent. Use “Open confirmation” or copy the link. To enable real emails, a site admin must configure delivery — see below.',
    adminSetupSummary: 'Email setup (site administrator)',
    adminSetupP1:
      'Create .env in the project root (see .env.example). EmailJS: VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID. Template fields: to_email, confirm_url, user_name. Restart dev or rebuild after changes.',
    adminSetupP2:
      'Or use your backend: VITE_VERIFICATION_EMAIL_ENDPOINT with POST JSON { "to", "confirmUrl" }. Restrict the EmailJS public key to your domain.',
    copyLink: 'Copy link',
    copied: 'Copied',
    openLink: 'Open confirmation',
    backToForm: 'Back to form',
    resend: 'Resend link',
    resendOk: 'A new confirmation email was sent.',
    resendOkNoMail: 'The link was updated but email was not sent — configure .env (EmailJS or API) and resend. For now copy or open the link below.',
    resendFail: 'Could not update the link. Try again later.',
    toLoginTab: 'Already confirmed? Sign in',
  },
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

const AUTH_PANEL_MS = 320;

export default function AuthModal({ open, onClose, initialTab = 'login' }) {
  const { lang } = usePreferences();
  const { login, register, resendVerification } = useAuth();
  const t = copy[lang] || copy.ru;
  const titleId = useId();
  const closeTimerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(initialTab);
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [confirmUrl, setConfirmUrl] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [copyDone, setCopyDone] = useState(false);
  const [resendHint, setResendHint] = useState('');
  const [emailDispatchOk, setEmailDispatchOk] = useState(null);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setStep('form');
      setError('');
      setEmail('');
      setPassword('');
      setPassword2('');
      setName('');
      setConfirmUrl('');
      setRegisteredEmail('');
      setCopyDone(false);
      setResendHint('');
      setEmailDispatchOk(null);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (open) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    closeTimerRef.current = setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, AUTH_PANEL_MS);
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  async function copyConfirmLink() {
    if (!confirmUrl) return;
    try {
      await navigator.clipboard.writeText(confirmUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = confirmUrl;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), 2000);
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  async function handleResendLogin() {
    if (!isValidEmail(email)) {
      setResendHint(t.errEmail);
      return;
    }
    setPending(true);
    setResendHint('');
    try {
      const r = await resendVerification(email);
      if (r.ok && r.confirmationUrl) {
        setConfirmUrl(r.confirmationUrl);
        setEmailDispatchOk(r.emailSent === true);
        setResendHint(r.emailSent ? t.resendOk : t.resendOkNoMail);
      } else {
        setResendHint(t.resendFail);
      }
    } finally {
      setPending(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResendHint('');
    if (!isValidEmail(email)) {
      setError(t.errEmail);
      return;
    }
    if (password.length < 6) {
      setError(t.errShort);
      return;
    }
    setPending(true);
    try {
      if (tab === 'register') {
        if (password !== password2) {
          setError(t.errMismatch);
          setPending(false);
          return;
        }
        const res = await register(email, password, name);
        if (!res.ok) {
          setError(res.code === 'exists' ? t.errExists : t.errInvalid);
          setPending(false);
          return;
        }
        setRegisteredEmail(res.email);
        setConfirmUrl(res.confirmationUrl || '');
        setEmailDispatchOk(res.emailSent === true);
        setStep('checkEmail');
      } else {
        const res = await login(email, password);
        if (!res.ok) {
          if (res.code === 'unverified') {
            setError(t.errUnverified);
          } else {
            setError(t.errInvalid);
          }
          setPending(false);
          return;
        }
        onClose();
      }
    } finally {
      setPending(false);
    }
  }

  if (!mounted) return null;

  return (
    <div
      className={`st-auth-modal-root${visible ? ' st-auth-modal-root--visible' : ''}`.trim()}
      role="presentation"
    >
      <button type="button" className="st-auth-modal-backdrop" aria-label={t.close} onClick={onClose} />
      <div
        className="st-auth-modal glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="st-auth-modal-head">
          <h2 id={titleId} className="st-auth-modal-title">
            {step === 'checkEmail'
              ? emailDispatchOk
                ? t.checkTitle
                : t.checkTitleNoMail
              : tab === 'login'
                ? t.titleLogin
                : t.titleRegister}
          </h2>
          <button type="button" className="st-auth-modal-close st-icon-btn" onClick={onClose} aria-label={t.close}>
            <MaterialIcon name="close" />
          </button>
        </div>

        {step === 'checkEmail' ? (
          <div className="st-auth-check st-auth-panel-anim" key="check">
            <p className="st-auth-check-lead">
              {emailDispatchOk ? t.checkLead : t.checkLeadNoMail}{' '}
              <strong className="st-auth-check-email">{registeredEmail}</strong>.
            </p>
            {emailDispatchOk ? (
              <p className="st-auth-note">{t.checkHint}</p>
            ) : (
              <>
                <p className="st-auth-note">{t.checkHintLinkOnly}</p>
                <p className="st-auth-note st-auth-note--soft">{t.checkEmailNotSentShort}</p>
                <details className="st-auth-details">
                  <summary className="st-auth-details-summary">{t.adminSetupSummary}</summary>
                  <div className="st-auth-details-body">
                    <p>{t.adminSetupP1}</p>
                    <p>{t.adminSetupP2}</p>
                  </div>
                </details>
              </>
            )}
            {confirmUrl ? (
              <div className="st-auth-link-row">
                <button type="button" className="st-auth-secondary-btn" onClick={copyConfirmLink}>
                  <MaterialIcon name="content_copy" />
                  {copyDone ? t.copied : t.copyLink}
                </button>
                <a className="st-auth-secondary-btn st-auth-secondary-btn--link" href={confirmUrl}>
                  <MaterialIcon name="open_in_new" />
                  {t.openLink}
                </a>
              </div>
            ) : null}
            <button
              type="button"
              className="st-auth-ghost-btn"
              onClick={() => {
                setStep('form');
                setTab('login');
              }}
            >
              {t.toLoginTab}
            </button>
          </div>
        ) : (
          <div className="st-auth-panel-anim" key="form">
            <div className="st-auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'login'}
                className={`st-auth-tab${tab === 'login' ? ' st-auth-tab--active' : ''}`.trim()}
                onClick={() => {
                  setTab('login');
                  setError('');
                  setResendHint('');
                }}
              >
                {t.tabLogin}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'register'}
                className={`st-auth-tab${tab === 'register' ? ' st-auth-tab--active' : ''}`.trim()}
                onClick={() => {
                  setTab('register');
                  setError('');
                  setResendHint('');
                }}
              >
                {t.tabRegister}
              </button>
            </div>
            <form className="st-auth-form" onSubmit={handleSubmit}>
              <div className="st-auth-tab-fields st-auth-tab-content-anim" key={tab}>
              {tab === 'register' && (
                <label className="st-auth-field">
                  <span className="st-auth-label">{t.name}</span>
                  <input
                    className="st-auth-input"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              )}
              <label className="st-auth-field">
                <span className="st-auth-label">{t.email}</span>
                <input
                  className="st-auth-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="st-auth-field">
                <span className="st-auth-label">{t.password}</span>
                <input
                  className="st-auth-input"
                  type="password"
                  name="password"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {tab === 'register' && (
                <label className="st-auth-field">
                  <span className="st-auth-label">{t.passwordAgain}</span>
                  <input
                    className="st-auth-input"
                    type="password"
                    name="password2"
                    autoComplete="new-password"
                    required
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </label>
              )}
              {error ? <p className="st-auth-error">{error}</p> : null}
              {error && tab === 'login' && error === t.errUnverified ? (
                <div className="st-auth-resend">
                  <button
                    type="button"
                    className="st-auth-secondary-btn"
                    disabled={pending}
                    onClick={handleResendLogin}
                  >
                    {t.resend}
                  </button>
                  {resendHint ? <p className="st-auth-hint">{resendHint}</p> : null}
                  {resendHint && confirmUrl ? (
                    <div className="st-auth-link-row st-auth-link-row--compact">
                      <button type="button" className="st-auth-secondary-btn" onClick={copyConfirmLink}>
                        {copyDone ? t.copied : t.copyLink}
                      </button>
                      <a className="st-auth-secondary-btn st-auth-secondary-btn--link" href={confirmUrl}>
                        {t.openLink}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
              </div>
              <button type="submit" className="st-auth-submit steel-gradient" disabled={pending}>
                {pending ? '…' : tab === 'login' ? t.submitLogin : t.submitRegister}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
