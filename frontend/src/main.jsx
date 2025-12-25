import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './Context/CartContext'
import { NotificationProvider } from './Context/NotificationContext'

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <CartProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </CartProvider>
  </BrowserRouter>
);
