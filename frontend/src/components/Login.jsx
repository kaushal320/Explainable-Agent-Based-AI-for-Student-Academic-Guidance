import React, { useState } from 'react';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { loginUser, registerUser } from '../api';

const Login = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { email, password };
      if (mode === 'register') {
        payload.full_name = fullName;
      }

      const data = mode === 'login' ? await loginUser(payload) : await registerUser(payload);
      onAuthenticated(data);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="scholar-card auth-card">
        <div className="scholar-header" style={{ padding: '2.25rem 2rem' }}>
          <h1 className="scholar-h1 text-white mb-2" style={{ fontSize: '2rem' }}>Scholar Access</h1>
          <p className="scholar-mini text-white opacity-70">Secure Student Login</p>
        </div>

        <div className="p-10">
          <div className="auth-mode-tabs">
            <button className={`auth-mode-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
              Login
            </button>
            <button className={`auth-mode-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <label className="auth-field">
                <span className="scholar-label">Full Name</span>
                <div className="auth-input-wrap">
                  <User size={18} className="text-indigo" />
                  <input
                    className="auth-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span className="scholar-label">Email</span>
              <div className="auth-input-wrap">
                <Mail size={18} className="text-indigo" />
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span className="scholar-label">Password</span>
              <div className="auth-input-wrap">
                <Lock size={18} className="text-indigo" />
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading} className="btn-premium">
              {loading ? <Loader2 className="animate-spin" size={20} /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
