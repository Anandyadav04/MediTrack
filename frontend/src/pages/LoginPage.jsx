import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, LogIn, AlertCircle } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left side: Image */}
      <div className="auth-image" style={{ backgroundImage: `url(${heroBg})` }}></div>

      {/* Right side: Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper fade-in card" style={{ padding: '60px 40px', background: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--brand-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} color="var(--brand-primary)" />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              MediTrack
            </span>
          </div>

          <h2 style={{ marginBottom: '8px', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>
            Enter your credentials to access your account.
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '16px',
              borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '14px',
              background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group mb-8">
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : (
                <>
                  Sign In <LogIn size={18} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', fontSize: '15px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ fontWeight: 600, color: 'var(--brand-primary)', textDecoration: 'none' }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
