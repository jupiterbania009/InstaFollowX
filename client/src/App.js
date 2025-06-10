import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VerifyFollows from './components/VerifyFollows';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token validity here if needed
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login setIsAuthenticated={setIsAuthenticated} />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Register setIsAuthenticated={setIsAuthenticated} />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-follows"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <VerifyFollows />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 