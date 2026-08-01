import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Assessment from './pages/Assessment';
import Reports from './pages/Reports';
import Caregiver from './pages/Caregiver';
import TeachingVideos from './pages/TeachingVideos';
import VRAssessment from './pages/VRAssessment';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/caregiver" element={<Caregiver />} />
              <Route path="/teaching-videos" element={<TeachingVideos />} />
              <Route path="/vr" element={<VRAssessment />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Anything else routes to NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


