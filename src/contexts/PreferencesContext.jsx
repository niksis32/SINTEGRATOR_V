import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEYS = {
  lang: 'sintegrator.lang',
  theme: 'sintegrator.theme',
};

const THEME_SWITCH_DELAY_MS = 110;
const THEME_SWITCH_HOLD_MS = 480;
const LANG_SWITCH_DELAY_MS = 220;
const LANG_SWITCH_HOLD_MS = 300;

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

function clearPrefTweenClasses() {
  document.documentElement.classList.remove('st-theme-tween', 'st-lang-tween');
}

export function PreferencesProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);
  const [theme, setTheme] = useState(getInitialTheme);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
      clearPrefTweenClasses();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    clearTimers();
    clearPrefTweenClasses();
    document.documentElement.classList.add('st-theme-tween');
    timersRef.current.push(
      window.setTimeout(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        timersRef.current.push(
          window.setTimeout(() => {
            document.documentElement.classList.remove('st-theme-tween');
          }, THEME_SWITCH_HOLD_MS),
        );
      }, THEME_SWITCH_DELAY_MS),
    );
  }, []);

  const toggleLang = useCallback(() => {
    clearTimers();
    clearPrefTweenClasses();
    document.documentElement.classList.add('st-lang-tween');
    timersRef.current.push(
      window.setTimeout(() => {
        setLang((prev) => (prev === 'ru' ? 'en' : 'ru'));
        timersRef.current.push(
          window.setTimeout(() => {
            document.documentElement.classList.remove('st-lang-tween');
          }, LANG_SWITCH_HOLD_MS),
        );
      }, LANG_SWITCH_DELAY_MS),
    );
  }, []);

  const api = useMemo(
    () => ({
      lang,
      theme,
      setLang,
      toggleLang,
      setTheme,
      toggleTheme,
    }),
    [lang, theme, toggleLang, toggleTheme],
  );

  return <PreferencesContext.Provider value={api}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}

