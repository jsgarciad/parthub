import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PartsListPage from './pages/parts/PartsListPage';
import PartDetailPage from './pages/parts/PartDetailPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected pages
import DashboardPage from './pages/admin/DashboardPage';
import ProfilePage from './pages/auth/ProfilePage';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Determine if user has a store
  const hasStore = user?.store !== undefined && user?.store !== null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={hasStore ? "/dashboard" : "/"} /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={hasStore ? "/dashboard" : "/"} /> : <RegisterPage />} />
          <Route path="/parts" element={<PartsListPage />} />
          <Route path="/parts/:id" element={<PartDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected routes - for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Store owner routes */}
          <Route element={<ProtectedRoute requireStore={true} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="bg-white py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PartHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
