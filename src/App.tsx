import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

const RoleSelection = React.lazy(() => import('./pages/RoleSelection'));
const DoctorLogin = React.lazy(() => import('./pages/DoctorLogin'));
const ParentLogin = React.lazy(() => import('./pages/ParentLogin'));
const ParentDashboard = React.lazy(() => import('./pages/ParentDashboard'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Patients = React.lazy(() => import('./pages/Patients'));
const Assessment = React.lazy(() => import('./pages/Assessment'));
const Reports = React.lazy(() => import('./pages/Reports'));
const TeachingVideos = React.lazy(() => import('./pages/TeachingVideos'));
const VRAssessment = React.lazy(() => import('./pages/VRAssessment'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            {/* Public Entry Experience Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/parent-login" element={<ParentLogin />} />

            {/* Protected Parent Dashboard Route */}
            <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/parent-dashboard" element={<ParentDashboard />} />
                <Route path="/teaching-videos" element={<TeachingVideos />} />
              </Route>
            </Route>

            {/* Legacy /login redirects to new doctor-login for ProtectedRoute compatibility */}
            <Route path="/login" element={<Navigate to="/doctor-login" replace />} />

            {/* Protected Dashboard Routes for Doctor/Clinician */}
            <Route element={<ProtectedRoute allowedRoles={['Clinician', 'doctor', 'Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/vr" element={<VRAssessment />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Anything else routes to NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}


