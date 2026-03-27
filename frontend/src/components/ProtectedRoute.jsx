import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles, requireVerification = true }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  console.log('ProtectedRoute Check:', {
    isAuthenticated,
    path: location.pathname,
    userId: user?.id,
    verified: user?.verified
  });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireVerification && !user.verified && user.role !== 'ADMIN' && location.pathname !== '/pending-verification') {
    console.log('Not verified, redirecting to pending-verification');
    return <Navigate to="/pending-verification" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    console.log('Unauthorized role, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
