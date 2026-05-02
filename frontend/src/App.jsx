import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Feedback from './components/Feedback';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { clearAuthSession, getAuthToken, getAuthUser, getMe } from './api';
import './App.css';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('career_tutor_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const token = getAuthToken();
    const cachedAuthUser = getAuthUser();

    if (!token) {
      setAuthLoading(false);
      return;
    }

    if (cachedAuthUser) {
      setAuthUser(cachedAuthUser);
    }

    getMe()
      .then((serverUser) => setAuthUser(serverUser))
      .catch(() => {
        clearAuthSession();
        setAuthUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleAuthenticated = (authData) => {
    setAuthUser(authData.user);
  };

  const handleOnboardingComplete = (userData) => {
    const nameFromAuth = authUser?.full_name || authUser?.email?.split('@')[0] || 'Scholar';
    const mergedUser = { ...userData, name: nameFromAuth, authUser };
    setUser(mergedUser);
    localStorage.setItem('career_tutor_user', JSON.stringify(mergedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setAuthUser(null);
    localStorage.removeItem('career_tutor_user');
    clearAuthSession();
  };

  if (authLoading) {
    return (
      <div className="App auth-loading-shell">
        <div className="auth-loading-card">Loading secure session...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar isAuthenticated={!!authUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/app/*" element={
          !authUser ? (
            <Login onAuthenticated={handleAuthenticated} />
          ) : !user ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Dashboard user={user} onLogout={handleLogout} />
          )
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
