import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  lang: 'sintegrator.lang',
  theme: 'sintegrator.theme',
};

function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEYS.lang);
  if (stored === 'en' || stored === 'ru') return stored;
  return 'ru';
}

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const api = useMemo(
    () => ({
      lang,
      theme,
      setLang,
      toggleLang: () => setLang((prev) => (prev === 'ru' ? 'en' : 'ru')),
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [lang, theme],
  );

  return <PreferencesContext.Provider value={api}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}

