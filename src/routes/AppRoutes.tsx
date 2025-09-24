import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { SignIn } from '../pages/auth/SignIn';
import { AdminPanel } from '../pages/admin/AdminPanel';
import { DoctorPanel } from '../pages/doctor/DoctorPanel';
import { ReceptionPanel } from '../pages/reception/ReceptionPanel';
import UserPage from '../pages/admin/User';
import Patients from '../pages/reception/patients';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, fetchMe, isLoading } = useAuthStore();
  console.log(isAuthenticated,'s');
  
  useEffect(() => {
    fetchMe(); 
  }, [fetchMe]);

  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );

  // 👇 Muhimi: fetchMe tugaguncha signIn page ko‘rinmasligi kerak
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
        <Route
          path="/signin"
          element={<Navigate to={`/${user?.role}`} replace />}
        />
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
        <Route path="/user" element={<UserPage />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Layout>
  );
};
