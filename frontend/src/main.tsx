import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { PartProvider } from './context/PartContext'
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PartProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </PartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
