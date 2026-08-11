import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-black text-secondary-800 text-lg tracking-tight">CampusConnect</p>
            <p className="text-sm font-medium text-secondary-400">Loading your network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '14px',
            fontWeight: '600',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
          },
        }}
      />
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/alumni" element={
              <ProtectedRoute><Alumni /></ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute><Jobs /></ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute><Events /></ProtectedRoute>
            } />
            <Route path="/chats" element={
              <ProtectedRoute roles={['STUDENT', 'ALUMNI', 'ADMIN']}><Chats /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute><PublicProfile /></ProtectedRoute>
            } />
            <Route path="/pending-verification" element={
              <ProtectedRoute requireVerification={false}><PendingVerification /></ProtectedRoute>
            } />
            <Route path="/connections" element={
              <ProtectedRoute><Connections /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}><AdminVerification /></ProtectedRoute>
            } />
            <Route path="/jobs/:id" element={
              <ProtectedRoute><JobDetails /></ProtectedRoute>
            } />
            <Route path="/events/:id" element={
              <ProtectedRoute><EventDetails /></ProtectedRoute>
            } />
            <Route path="/interview-prep" element={
              <ProtectedRoute roles={['STUDENT', 'ALUMNI']}><InterviewPrep /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><Notifications /></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </div>
  );
}
