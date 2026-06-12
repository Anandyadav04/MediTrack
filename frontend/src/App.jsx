import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import client from './api/client';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HealthTrackerPage from './pages/HealthTrackerPage';
import SkinDiagnosisPage from './pages/SkinDiagnosisPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RemindersPage from './pages/RemindersPage';
import LandingPage from './pages/LandingPage';
import RentalsPage from './pages/RentalsPage';
import NgosPage from './pages/NgosPage';
import { Activity, LogOut, ShieldAlert, Calendar, Clock, Heart, Thermometer, User, Truck, HeartHandshake, ChevronDown } from 'lucide-react';

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
  const [upcoming, setUpcoming] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await client.get('appointments/bookings/');
        const booked = res.data.find(a => a.status === 'Scheduled' && a.is_upcoming);
        setUpcoming(booked || null);
      } catch (err) {
        console.error('Failed to load upcoming appt');
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        color: '#ffffff',
        textAlign: 'left',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', marginBottom: '8px' }}>
            Patient Portal Dashboard
          </span>
          <h1 style={{ fontSize: '32px', color: '#ffffff', marginBottom: '6px' }}>
            Welcome back, {user?.username || 'User'} 👋
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px' }}>
            Access all your healthcare monitoring, scheduling and prescription logs.
          </p>
        </div>
        
        {upcoming && (
          <div className="glass-panel" style={{ 
            padding: '16px 24px', 
            textAlign: 'left', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            borderLeft: '4px solid var(--success)', 
            maxWidth: '380px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.15)'
          }}>
            <Calendar size={32} color="var(--success)" />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>Next Appointment</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Dr. {upcoming.doctor_detail?.name}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                {upcoming.appointment_date} @ {upcoming.appointment_time.substring(0, 5)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tools Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px'
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
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
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--success)'
          }}>
            <Heart size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Health Monitoring</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
            Schedule medication SMS/Email alerts via Celery task execution queues.
          </p>
        </Link>

        {/* Equipment Rentals card */}
        <Link to="/rentals" className="glass-panel" style={{
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
            <Truck size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Equipment Rentals</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
            Rent medical devices, wheelchairs, oxygen cylinders, and healthcare equipment.
          </p>
        </Link>

        {/* Medical Resources card */}
        <Link to="/ngos" className="glass-panel" style={{
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
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'var(--success)'
          }}>
            <HeartHandshake size={24} />
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Medical Resources</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
            Connect with verified health NGOs offering free check-ups, camps, and assistance.
          </p>
        </Link>
      </div>
    </div>
  );
};

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar glass-panel" style={{ position: 'relative', zIndex: 1000 }}>
      <Link to="/" className="nav-brand" onClick={() => setDropdownOpen(false)}>
        <Activity size={28} color="var(--brand-primary)" />
        <span>MediTrack</span>
      </Link>
      
      {isAuthenticated ? (
        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px', listStyle: 'none' }}>
          <li>
            <Link to="/" className="nav-item" onClick={() => setDropdownOpen(false)}>
              Dashboard
            </Link>
          </li>
          
          {!user?.is_doctor && (
            <>
              <li>
                <Link to="/appointments" className="nav-item" onClick={() => setDropdownOpen(false)}>
                  Appointments
                </Link>
              </li>
              
              {/* Services Dropdown */}
              <li ref={dropdownRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="nav-item"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all var(--transition-fast)',
                    color: dropdownOpen ? 'var(--brand-primary)' : 'var(--text-secondary)'
                  }}
                >
                  Services <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                
                {dropdownOpen && (
                  <div className="glass-panel fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '200px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1010,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    <Link to="/diagnosis" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      🧠 Skin Diagnosis
                    </Link>
                    <Link to="/health" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      📊 Health Tracker
                    </Link>
                    <Link to="/reminders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      ⏰ Reminders
                    </Link>
                    <Link to="/rentals" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      📦 Rentals
                    </Link>
                    <Link to="/ngos" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      🤝 NGOs
                    </Link>
                  </div>
                )}
              </li>
            </>
          )}
          
          <li style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              {user?.is_doctor ? `Dr. ${user?.username}` : user?.username}
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

const HomeWrapper = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading application...</div>;
  if (!isAuthenticated) return <LandingPage />;
  if (user?.is_doctor) return <AppointmentsPage />;
  return <HomePage />;
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
            
            <Route path="/" element={<HomeWrapper />} />
            
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

            <Route path="/rentals" element={
              <ProtectedRoute>
                <RentalsPage />
              </ProtectedRoute>
            } />

            <Route path="/ngos" element={
              <ProtectedRoute>
                <NgosPage />
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
