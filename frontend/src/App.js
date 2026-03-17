import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard.js';
import EmployeePage from './pages/EmployeePage';
import TransactionPage from './pages/TransactionPage';
import FraudAlertsPage from './pages/FraudAlertsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <AdminProtectedRoute>
                <Layout>
                  <EmployeePage />
                </Layout>
              </AdminProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Layout>
                  <TransactionPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/fraud-alerts" element={
              <ProtectedRoute>
                <Layout>
                  <FraudAlertsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Layout component to wrap pages with Sidebar and Navbar
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6">
        <div className="text-center text-sm text-gray-600">
          <span className="font-medium">Need Help?</span> Contact the IT support team for assistance with the fraud monitoring system.
        </div>
      </footer>
    </div>
  );
}

export default App;
