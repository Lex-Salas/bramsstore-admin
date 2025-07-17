import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import BramsStoreAdmin from './App';

// Crear el root de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <BramsStoreAdmin />
  </React.StrictMode>
);

// Configuración para PWA (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
