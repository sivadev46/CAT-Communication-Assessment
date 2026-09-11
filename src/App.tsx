import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LearnerLayout from './layouts/LearnerLayout';
import LearnerLogin from './pages/LearnerLogin';

const Preloader = React.lazy(() => import('./pages/Preloader'));
const RoleSelection = React.lazy(() => import('./pages/RoleSelection'));
const DoctorLogin = React.lazy(() => import('./pages/DoctorLogin'));
const ParentLogin = React.lazy(() => import('./pages/ParentLogin'));
const ParentDashboard = React.lazy(() => import('./pages/ParentDashboard'));
const LearnerDashboard = React.lazy(() => import('./pages/LearnerDashboard'));
const LearnerLearningModules = React.lazy(() => import('./pages/LearnerLearningModules'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Patients = React.lazy(() => import('./pages/Patients'));
const Assessment = React.lazy(() => import('./pages/Assessment'));
const AssessmentHistory = React.lazy(() => import('./pages/AssessmentHistory'));
const Reports = React.lazy(() => import('./pages/Reports'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminModules = React.lazy(() => import('./pages/AdminModules'));
const AdminActivities = React.lazy(() => import('./pages/AdminActivities'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-[#ffffb3] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            {/* Public Entry & Assessment Portal Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/preloader" element={<RoleSelection />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/assessment-portal" element={<RoleSelection />} />

            {/* Login Routes */}
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/parent-login" element={<ParentLogin />} />
            <Route path="/login" element={<Navigate to="/doctor-login" replace />} />
            <Route path="/learner-login" element={<LearnerLogin />} />

            {/* Protected Routes for Doctor, Clinician, Therapist, Parent, and Admin Portals */}
            <Route element={<ProtectedRoute allowedRoles={['parent', 'Clinician', 'doctor', 'therapist', 'Admin', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                {/* Parent Portal */}
                <Route path="/parent-dashboard" element={<ParentDashboard />} />
                
                {/* Therapist / Clinician Portal */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/assessment-history" element={<AssessmentHistory />} />

                {/* Common Assessment & Reports (Role-Aware) */}
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/reports" element={<Reports />} />

                {/* Admin Portal */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-modules" element={<AdminModules />} />
                <Route path="/admin-activities" element={<AdminActivities />} />
                <Route path="/admin-users" element={<AdminUsers />} />
              </Route>
            </Route>

            {/* Dedicated Protected Routes for Learner Portal */}
            <Route element={<ProtectedRoute allowedRoles={['learner']} />}>
              <Route element={<LearnerLayout />}>
                <Route path="/learner-dashboard" element={<LearnerDashboard />} />
                <Route path="/learner-learning-modules" element={<LearnerLearningModules />} />
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
