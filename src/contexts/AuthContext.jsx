import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { notifyVerificationEmail } from '../lib/notifyVerificationEmail.js';

const STORAGE = {
  accounts: 'sintegrator.accounts',
  session: 'sintegrator.session',
};

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

async function hashPassword(password) {
  const buf = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function readSessionUser() {
  const s = readJson(STORAGE.session, null);
  if (s && typeof s.email === 'string' && typeof s.name === 'string') {
    return { email: s.email, name: s.name };
  }
  return null;
}

/** Учётные записи до введения verified считаем уже подтверждёнными */
function normalizeAccount(raw) {
  if (!raw || typeof raw.email !== 'string') return null;
  const verified = raw.verified !== false;
  return {
    email: raw.email,
    name: typeof raw.name === 'string' ? raw.name : raw.email.split('@')[0],
    passwordHash: raw.passwordHash,
    verified,
    verifyToken: typeof raw.verifyToken === 'string' ? raw.verifyToken : null,
  };
}

function readAccounts() {
  const list = readJson(STORAGE.accounts, []);
  if (!Array.isArray(list)) return [];
  return list.map(normalizeAccount).filter(Boolean);
}

function writeAccounts(accounts) {
  writeJson(STORAGE.accounts, accounts);
}

function buildConfirmationUrl(token) {
  const base = import.meta.env.BASE_URL || '/';
  const path = `${base.replace(/\/?$/, '')}/verify-email`;
  const url = new URL(path, window.location.origin);
  url.searchParams.set('token', token);
  return url.toString();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSessionUser());

  const persistSession = useCallback((next) => {
    if (next) writeJson(STORAGE.session, next);
    else localStorage.removeItem(STORAGE.session);
    setUser(next);
  }, []);

  const verifyEmail = useCallback((token) => {
    const t = String(token || '').trim();
    if (!t) return { ok: false };
    const cacheKey = `sintegrator.verified:${t}`;
    if (sessionStorage.getItem(cacheKey) === '1') return { ok: true };

    const accounts = readAccounts();
    const idx = accounts.findIndex((a) => a.verifyToken === t);
    if (idx === -1) return { ok: false };
    const next = [...accounts];
    next[idx] = { ...next[idx], verified: true, verifyToken: null };
    writeAccounts(next);
    sessionStorage.setItem(cacheKey, '1');
    return { ok: true, email: next[idx].email };
  }, []);

  const login = useCallback(async (email, password) => {
    const normalized = normalizeEmail(email);
    const accounts = readAccounts();
    const hash = await hashPassword(password);
    const found = accounts.find((a) => a.email === normalized && a.passwordHash === hash);
    if (!found) return { ok: false, code: 'invalid' };
    if (!found.verified) return { ok: false, code: 'unverified' };
    persistSession({ email: found.email, name: found.name });
    return { ok: true };
  }, [persistSession]);

  const register = useCallback(async (email, password, name) => {
    const normalized = normalizeEmail(email);
    const displayName = String(name).trim() || normalized.split('@')[0] || normalized;
    const accounts = readAccounts();
    if (accounts.some((a) => a.email === normalized)) return { ok: false, code: 'exists' };
    const passwordHash = await hashPassword(password);
    const verifyToken = crypto.randomUUID();
    const confirmationUrl = buildConfirmationUrl(verifyToken);
    const next = [
      ...accounts,
      {
        email: normalized,
        name: displayName,
        passwordHash,
        verified: false,
        verifyToken,
      },
    ];
    writeAccounts(next);
    const mail = await notifyVerificationEmail({
      to: normalized,
      confirmUrl: confirmationUrl,
      displayName: displayName,
    });
    return { ok: true, email: normalized, confirmationUrl, emailSent: mail.sent === true };
  }, []);

  const resendVerification = useCallback(async (email) => {
    const normalized = normalizeEmail(email);
    const accounts = readAccounts();
    const idx = accounts.findIndex((a) => a.email === normalized);
    if (idx === -1) return { ok: false, code: 'notfound' };
    if (accounts[idx].verified) return { ok: false, code: 'already' };
    const verifyToken = crypto.randomUUID();
    const confirmationUrl = buildConfirmationUrl(verifyToken);
    const next = [...accounts];
    next[idx] = { ...next[idx], verifyToken };
    writeAccounts(next);
    const name = next[idx].name || normalized.split('@')[0];
    const mail = await notifyVerificationEmail({
      to: normalized,
      confirmUrl: confirmationUrl,
      displayName: name,
    });
    return { ok: true, confirmationUrl, emailSent: mail.sent === true };
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const api = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      verifyEmail,
      resendVerification,
    }),
    [user, login, register, logout, verifyEmail, resendVerification],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
