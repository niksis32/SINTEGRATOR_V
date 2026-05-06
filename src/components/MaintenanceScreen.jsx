import { useCallback, useId, useState } from 'react';
import './maintenance.css';
import MaintenanceWorkCanvas from './MaintenanceWorkCanvas.jsx';
import {
  maintenanceAccessCode,
  setMaintenanceBypass,
} from '../config/siteVisibility.js';

export default function MaintenanceScreen({ onUnlocked }) {
  const formId = useId();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = useCallback(
    (e) => {
      e.preventDefault();
      const expected = maintenanceAccessCode;
      if (!expected) {
        setError('Код доступа не настроен. Укажите VITE_MAINTENANCE_ACCESS_CODE в окружении.');
        return;
      }
      if (code.trim() !== expected) {
        setError('Неверный код. Проверьте ввод и попробуйте снова.');
        return;
      }
      setError('');
      setMaintenanceBypass();
      onUnlocked();
    },
    [code, onUnlocked],
  );

  return (
    <div className="st-maintenance">
      <div className="st-maintenance__glow" aria-hidden="true" />
      <MaintenanceWorkCanvas className="st-maintenance__canvas" />
      <div className="st-maintenance__panel">
        <p className="st-maintenance__eyebrow">Синтегратор</p>
        <h1 className="st-maintenance__title">Сайт в разработке</h1>
        <p className="st-maintenance__lead">
          Мы обновляем витрину и инженерные материалы. Публичный запуск будет объявлен отдельно.
        </p>
        <form className="st-maintenance__form" onSubmit={submit} noValidate>
          <label className="st-maintenance__label" htmlFor={`${formId}-code`}>
            Код доступа для просмотра
          </label>
          <div className="st-maintenance__row">
            <input
              id={`${formId}-code`}
              className="st-maintenance__input"
              type="password"
              name="access-code"
              autoComplete="current-password"
              placeholder="Введите код"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError('');
              }}
            />
            <button type="submit" className="st-maintenance__submit">
              Войти
            </button>
          </div>
          {error ? (
            <p className="st-maintenance__error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
        <p className="st-maintenance__hint">
          Динамическая схема выше генерируется в браузере и символизирует активные работы над
          интеграционной архитектурой.
        </p>
      </div>
    </div>
  );
}
