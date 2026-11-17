import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import { CompareProvider } from './context/CompareContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <BasketProvider>
              <CompareProvider>
                <App />
              </CompareProvider>
            </BasketProvider>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
