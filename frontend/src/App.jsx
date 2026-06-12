import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HealthTrackerPage from './pages/HealthTrackerPage';
import SkinDiagnosisPage from './pages/SkinDiagnosisPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RemindersPage from './pages/RemindersPage';
import { Activity, LogOut, ShieldAlert, Calendar, Clock, Heart, Thermometer, User } from 'lucide-react';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading application...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Temp pages (to be replaced in subsequent phases)
const HomePage = () => {
  const { user } = useAuth();
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Welcome back, {user?.username || 'User'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Your digital health dashboard overview
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        {/* Skin Diagnosis card */}
        <Link to="/diagnosis" className="glass-panel" style={{
          padding: '24px',
          textAlign: 'left',
          display: 'block',
          color: 'inherit',
          transition: 'all var(--transition-fast)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--brand-primary)'
          }}>
            <Thermometer size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>AI Skin Diagnosis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Upload skin scans and leverage deep learning models for classification.
          </p>
        </Link>

        {/* Health Tracker card */}
        <Link to="/health" className="glass-panel" style={{
          padding: '24px',
          textAlign: 'left',
          display: 'block',
          color: 'inherit',
          transition: 'all var(--transition-fast)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(236, 72, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--success)'
          }}>
            <Heart size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Health Monitoring</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Calculate instantly and keep logs of your weight, height, BMR, and BMI metrics.
          </p>
        </Link>

        {/* Appointments card */}
        <Link to="/appointments" className="glass-panel" style={{
          padding: '24px',
          textAlign: 'left',
          display: 'block',
          color: 'inherit',
          transition: 'all var(--transition-fast)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(14, 165, 233, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--brand-secondary)'
          }}>
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Book Appointment</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Browse available doctors, check schedules, and reserve appointment slots.
          </p>
        </Link>

        {/* Reminders card */}
        <Link to="/reminders" className="glass-panel" style={{
          padding: '24px',
          textAlign: 'left',
          display: 'block',
          color: 'inherit',
          transition: 'all var(--transition-fast)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--warning)'
          }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Reminders</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Schedule medication SMS/Email alerts via Celery task execution queues.
          </p>
        </Link>
      </div>
    </div>
  );
};

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-brand">
        <Activity size={28} color="var(--brand-primary)" />
        <span>MediTrack</span>
      </Link>
      
      {isAuthenticated ? (
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Dashboard</Link></li>
          <li><Link to="/diagnosis" className="nav-item">Skin Diagnosis</Link></li>
          <li><Link to="/health" className="nav-item">Health Tracker</Link></li>
          <li><Link to="/appointments" className="nav-item">Appointments</Link></li>
          <li><Link to="/reminders" className="nav-item">Reminders</Link></li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              {user?.username}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <LogOut size={14} />
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Navigation />
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/diagnosis" element={
              <ProtectedRoute>
                <SkinDiagnosisPage />
              </ProtectedRoute>
            } />

            <Route path="/health" element={
              <ProtectedRoute>
                <HealthTrackerPage />
              </ProtectedRoute>
            } />

            <Route path="/appointments" element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            } />

            <Route path="/reminders" element={
              <ProtectedRoute>
                <RemindersPage />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
