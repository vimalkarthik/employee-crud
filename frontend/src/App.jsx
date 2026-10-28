import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import EmployeeCreate from './pages/EmployeeCreate.jsx';
import EmployeeEdit from './pages/EmployeeEdit.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/create"
        element={
          <ProtectedRoute>
            <EmployeeCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/:id/edit"
        element={
          <ProtectedRoute>
            <EmployeeEdit />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  );
}
