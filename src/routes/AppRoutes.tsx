import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { SignIn } from '../pages/auth/SignIn';
import { AdminPanel } from '../pages/admin/AdminPanel';
import { DoctorPanel } from '../pages/doctor/DoctorPanel';
import { ReceptionPanel } from '../pages/reception/ReceptionPanel';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/signin" element={<Navigate to={`/${user?.role}`} replace />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reception" 
          element={
            <ProtectedRoute allowedRoles={['reception']}>
              <ReceptionPanel />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to={`/${user?.role}`} replace />} />
        <Route path="*" element={<Navigate to={`/${user?.role}`} replace />} />
      </Routes>
    </Layout>
  );
};