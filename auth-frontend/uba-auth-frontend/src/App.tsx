import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginForm from './_components/auth/LoginForm';
import RegisterForm from './_components/auth/RegisterForm';
import ProtectedRoute from './_components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminRoleManager from './pages/AdminRoleManager';
import DeleteUser from './_components/crud/DeleteUser';
import ViewUsers from './pages/ViewUsers';
import CreateUser from './pages/CreateUser';
import UserUpdateManager from './_components/crud/UpdateUser';


const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <>
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginForm />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterForm onSwitchToLogin={() => navigate('/login')} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/superadmin/roles" element={<ProtectedRoute><AdminRoleManager /></ProtectedRoute>} />
      <Route
        path="/superadmin/delete-user"
        element={
          <ProtectedRoute>
            <DeleteUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-user"
        element={
          <ProtectedRoute>
           <ViewUsers/>
          </ProtectedRoute>
        }
      />
       <Route
        path="/create-user"
        element={
          <ProtectedRoute>
           <CreateUser/>
          </ProtectedRoute>
        }
      />
        <Route
        path="/update-user"
        element={
          <ProtectedRoute>
           <UserUpdateManager/>
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;
