import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePreferences } from '../contexts/PreferencesContext.jsx';

const copy = {
  ru: {
    loading: 'Подтверждаем email…',
    okTitle: 'Аккаунт подтверждён',
    okText: 'Теперь вы можете войти с email и паролем.',
    toLogin: 'Перейти ко входу',
    badTitle: 'Ссылка недействительна',
    badText: 'Срок действия истёк или ссылка уже использована. Запросите новое письмо на экране входа.',
    home: 'На главную',
    noToken: 'В ссылке нет кода подтверждения.',
  },
  en: {
    loading: 'Confirming your email…',
    okTitle: 'Account confirmed',
    okText: 'You can now sign in with your email and password.',
    toLogin: 'Go to sign in',
    badTitle: 'Invalid link',
    badText: 'This link has expired or was already used. Request a new message on the sign-in screen.',
    home: 'Home',
    noToken: 'This link is missing a confirmation token.',
  },
};

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail } = useAuth();
  const { lang } = usePreferences();
  const t = copy[lang] || copy.ru;
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    if (!token) {
      setPhase('bad');
      return;
    }
    const r = verifyEmail(token);
    setPhase(r.ok ? 'ok' : 'bad');
  }, [token, verifyEmail]);

  return (
    <div className="st-container st-verify-page">
      <div className="st-verify-card milled-surface">
        {phase === 'loading' && <p className="st-text-muted">{t.loading}</p>}
        {phase === 'ok' && (
          <>
            <h1 className="st-verify-title">{t.okTitle}</h1>
            <p className="st-text-muted">{t.okText}</p>
            <Link className="st-btn-head steel-gradient st-verify-cta" to="/?login=1">
              {t.toLogin}
            </Link>
          </>
        )}
        {phase === 'bad' && (
          <>
            <h1 className="st-verify-title">{t.badTitle}</h1>
            <p className="st-text-muted">{!token ? t.noToken : t.badText}</p>
            <Link className="st-auth-entry st-verify-cta" to="/">
              {t.home}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
