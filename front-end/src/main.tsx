import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Importar utilitários de teste (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  import('./utils/testAuth.ts');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)