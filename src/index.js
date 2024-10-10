// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Asegúrate de importar BrowserRouter
import App from './App'; // Importa tu componente App
import './index.css'; // Importa tus estilos

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> {/* Envuelve tu App con BrowserRouter */}
    <App />
  </BrowserRouter>
);
