import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import './styles-home.css';
import App from './App.jsx';
import { PreferencesProvider } from './contexts/PreferencesContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreferencesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PreferencesProvider>
  </React.StrictMode>,
);
