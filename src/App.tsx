import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import RegisterForm from './_components/auth/RegisterForm';
import LoginForm from './_components/auth/LoginForm';

export function App() {
  const isAuthenticated = false;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/Homepage" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/register"
          element={<RegisterForm  />}
        />
        <Route
          path="/login"
          element={<LoginForm  />}
        />
      </Routes>
    </>
  );
}

export default App;
