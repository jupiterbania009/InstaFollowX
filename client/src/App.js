import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FollowVerification from './components/FollowVerification';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/verify-follows"
            element={
              <PrivateRoute>
                <FollowVerification />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 