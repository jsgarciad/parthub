import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SellersPage } from './pages/SellersPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
          <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
          <Route path="/sellers" element={<MainLayout><SellersPage /></MainLayout>} />
          <Route path="/category/:category" element={<MainLayout><ProductsPage /></MainLayout>} />
          <Route path="/search" element={<MainLayout><ProductsPage /></MainLayout>} />
          {/* Add more routes as needed */}
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
