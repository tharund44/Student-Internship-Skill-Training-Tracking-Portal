import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute, RoleRoute } from './components/layout/ProtectedRoute';
import { CommandPalette } from './components/ui/CommandPalette';
import { useAuthStore } from './store/useAuthStore';

// Lazy loading all pages to optimize bundle size
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const DesignSystem = lazy(() => import('./pages/DesignSystem').then(m => ({ default: m.DesignSystem })));
const DashboardRouter = lazy(() => import('./pages/dashboards/Dashboards').then(m => ({ default: m.DashboardRouter })));
const Unauthorized = lazy(() => import('./pages/dashboards/Dashboards').then(m => ({ default: m.Unauthorized })));
const VerifyCertificate = lazy(() => import('./pages/public/VerifyCertificate').then(m => ({ default: m.VerifyCertificate })));

// Student Pages
const StudentProfile = lazy(() => import('./pages/student/Profile').then(m => ({ default: m.Profile })));
const BrowseInternships = lazy(() => import('./pages/student/BrowseInternships').then(m => ({ default: m.BrowseInternships })));
const InternshipDetails = lazy(() => import('./pages/student/InternshipDetails').then(m => ({ default: m.InternshipDetails })));
const MyApplications = lazy(() => import('./pages/student/MyApplications').then(m => ({ default: m.MyApplications })));
const BrowseTrainings = lazy(() => import('./pages/student/BrowseTrainings').then(m => ({ default: m.BrowseTrainings })));
const TrainingDetails = lazy(() => import('./pages/student/TrainingDetails').then(m => ({ default: m.TrainingDetails })));
const MyEnrollments = lazy(() => import('./pages/student/MyEnrollments').then(m => ({ default: m.MyEnrollments })));
const MyProgress = lazy(() => import('./pages/student/MyProgress').then(m => ({ default: m.MyProgress })));
const Documents = lazy(() => import('./pages/student/Documents').then(m => ({ default: m.Documents })));
const Certificates = lazy(() => import('./pages/student/Certificates').then(m => ({ default: m.Certificates })));

// Org Pages
const CreateInternship = lazy(() => import('./pages/org/CreateInternship').then(m => ({ default: m.CreateInternship })));
const ManageApplicants = lazy(() => import('./pages/org/ManageApplicants').then(m => ({ default: m.ManageApplicants })));
const CreateTraining = lazy(() => import('./pages/org/CreateTraining').then(m => ({ default: m.CreateTraining })));
const ManageEnrollments = lazy(() => import('./pages/org/ManageEnrollments').then(m => ({ default: m.ManageEnrollments })));
const UpdateProgress = lazy(() => import('./pages/org/UpdateProgress').then(m => ({ default: m.UpdateProgress })));

// Admin Pages
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents').then(m => ({ default: m.ManageStudents })));
const ReviewApplications = lazy(() => import('./pages/admin/ReviewApplications').then(m => ({ default: m.ReviewApplications })));
const ManageTrainings = lazy(() => import('./pages/admin/ManageTrainings').then(m => ({ default: m.ManageTrainings })));
const MonitorProgress = lazy(() => import('./pages/admin/MonitorProgress').then(m => ({ default: m.MonitorProgress })));
const VerifyDocuments = lazy(() => import('./pages/admin/VerifyDocuments').then(m => ({ default: m.VerifyDocuments })));
const ManageCertificates = lazy(() => import('./pages/admin/ManageCertificates').then(m => ({ default: m.ManageCertificates })));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers').then(m => ({ default: m.ManageUsers })));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const Reports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.Reports })));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <CommandPalette />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="design-system" element={<DesignSystem />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardRouter />} />
              
              {/* Student */}
              <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
                <Route path="student/profile" element={<StudentProfile />} />
                <Route path="student/browse" element={<BrowseInternships />} />
                <Route path="student/internships/:id" element={<InternshipDetails />} />
                <Route path="student/applications" element={<MyApplications />} />
                <Route path="student/trainings" element={<BrowseTrainings />} />
                <Route path="student/trainings/:id" element={<TrainingDetails />} />
                <Route path="student/enrollments" element={<MyEnrollments />} />
                <Route path="student/progress" element={<MyProgress />} />
                <Route path="student/documents" element={<Documents />} />
                <Route path="student/certificates" element={<Certificates />} />
              </Route>
              
              {/* Org */}
              <Route element={<RoleRoute allowedRoles={['ORGANIZATION']} />}>
                <Route path="org/internships/create" element={<CreateInternship />} />
                <Route path="org/internships/:id/applicants" element={<ManageApplicants />} />
                <Route path="org/trainings/create" element={<CreateTraining />} />
                <Route path="org/trainings/:id/enrollments" element={<ManageEnrollments />} />
                <Route path="org/progress" element={<UpdateProgress />} />
              </Route>
              
              {/* Admin */}
              <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path="admin/users" element={<ManageUsers />} />
                <Route path="admin/students" element={<ManageStudents />} />
                <Route path="admin/applications" element={<ReviewApplications />} />
                <Route path="admin/trainings" element={<ManageTrainings />} />
                <Route path="admin/progress" element={<MonitorProgress />} />
                <Route path="admin/documents" element={<VerifyDocuments />} />
                <Route path="admin/certificates" element={<ManageCertificates />} />
                <Route path="admin/audit-logs" element={<AuditLogs />} />
                <Route path="admin/reports" element={<Reports />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
