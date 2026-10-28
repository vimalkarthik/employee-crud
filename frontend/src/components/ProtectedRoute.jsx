import { Navigate } from 'react-router-dom';

// Equivalent of Laravel's `->middleware(['auth', 'nocache'])` route group.
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
