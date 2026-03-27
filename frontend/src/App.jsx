import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Alumni from './pages/Alumni';
import Jobs from './pages/Jobs';
import Events from './pages/Events';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import PendingVerification from './pages/PendingVerification';
import Connections from './pages/Connections';
import AdminVerification from './pages/AdminVerification';
import JobDetails from './pages/JobDetails';
import EventDetails from './pages/EventDetails';
import PublicProfile from './pages/PublicProfile';
import InterviewPrep from './pages/InterviewPrep';
import Notifications from './pages/Notifications';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="font-semibold text-secondary-500">Loading CampusConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/alumni" element={
            <ProtectedRoute>
              <Alumni />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/chats" element={
            <ProtectedRoute roles={['STUDENT', 'ALUMNI', 'ADMIN']}>
              <Chats />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <PublicProfile />
            </ProtectedRoute>
          } />
          <Route path="/pending-verification" element={
            <ProtectedRoute requireVerification={false}>
              <PendingVerification />
            </ProtectedRoute>
          } />
          <Route path="/connections" element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminVerification />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:id" element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          } />
          <Route path="/interview-prep" element={
            <ProtectedRoute roles={['STUDENT', 'ALUMNI']}>
              <InterviewPrep />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </div>
  );
}
