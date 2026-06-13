import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, UserPlus, AlertCircle } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    const result = await register(username, email, password, isDoctor);
    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left side: Form */}
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

          <h2 style={{ marginBottom: '8px', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>
            Join our platform for personalized wellness solutions.
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
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group mb-8" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="isDoctor"
                checked={isDoctor}
                onChange={(e) => setIsDoctor(e.target.checked)}
                disabled={loading}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
              />
              <label htmlFor="isDoctor" style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Register as a Healthcare Provider
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account <UserPlus size={18} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', fontSize: '15px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--brand-primary)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image (Swapped for variety) */}
      <div className="auth-image" style={{ backgroundImage: `url(${heroBg})`, transform: 'scaleX(-1)' }}>
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(to left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
      </div>
    </div>
  );
};

export default SignupPage;
