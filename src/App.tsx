import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import MenuManagement from './pages/MenuManagement';
import OrderManagement from './pages/OrderManagement';
import Reservations from './pages/Reservations';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;