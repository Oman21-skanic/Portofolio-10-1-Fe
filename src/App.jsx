import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashbaord';
import MainPage from './pages/MainPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/me', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
        });
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        const data = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(data.role === 'admin');
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Redirect to main page if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama */}
        <Route path="/" element={<MainPage />} />
        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />
        {/* Halaman Register */}
        <Route path="/register" element={<Register />} />
        {/* Halaman Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}