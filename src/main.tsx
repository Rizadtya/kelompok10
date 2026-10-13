import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from './state/ConfigContext';
import { AuthProvider } from './state/AuthContext';
import { AuthGate } from './components/auth/AuthGate';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthGate>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </AuthGate>
    </AuthProvider>
  </React.StrictMode>,
);
