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
import { Activity, LogOut, Calendar, Clock, Heart, Thermometer, User, Truck, HeartHandshake, Menu, ArrowRight } from 'lucide-react';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center mt-8">Loading application...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Simplified HomePage
const HomePage = () => {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState(null);
  const [pending, setPending] = useState(null);
  const [latestHealth, setLatestHealth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await client.get('appointments/bookings/');
        const booked = apptRes.data.find(a => a.status === 'Scheduled' && a.is_upcoming);
        const pendingAppt = apptRes.data.find(a => a.status === 'Pending');
        setUpcoming(booked || null);
        setPending(pendingAppt || null);
      } catch (err) {
        console.error('Failed to load appointments');
      }

      try {
        const healthRes = await client.get('health/');
        if (healthRes.data && healthRes.data.length > 0) {
          setLatestHealth(healthRes.data[0]);
        }
      } catch (err) {
        console.error('Failed to load health logs');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      
      {/* Dashboard Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
          Welcome back, {user?.username || 'User'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginTop: '8px' }}>
          Here is your personalized healthcare overview for today.
        </p>
      </div>

      <div className="flex-col gap-8">
        
        {/* Status Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Appointments Card */}
          <div className="card" style={{ padding: '32px', background: 'var(--brand-primary-light)', display: 'flex', flexDirection: 'column' }}>
            <span className="badge badge-light" style={{ background: '#fff', color: 'var(--brand-primary)', width: 'fit-content', marginBottom: '16px' }}>Appointments</span>
            <h2 style={{ fontSize: '24px', color: 'var(--brand-primary)', marginBottom: '8px' }}>
              {upcoming ? 'Upcoming Appointment' : (pending ? 'Appointment Pending' : 'No Active Appointments')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', flex: 1 }}>
              {upcoming 
                ? `Dr. ${upcoming.doctor_name} at ${new Date(upcoming.appointment_date).toLocaleString()}`
                : (pending ? `Waiting for approval from Dr. ${pending.doctor_name}` : 'You have no pending or scheduled appointments at this time.')}
            </p>
            <Link to="/appointments" className="glass-pill" style={{ background: '#fff', color: 'var(--brand-primary)', alignSelf: 'flex-start', textDecoration: 'none' }}>
              {upcoming || pending ? 'View Details' : 'Book Appointment'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>

          {/* Health Profile Card */}
          <div className="card" style={{ padding: '32px', background: 'var(--success-light)', display: 'flex', flexDirection: 'column' }}>
            <span className="badge badge-light" style={{ background: '#fff', color: 'var(--success)', width: 'fit-content', marginBottom: '16px' }}>Health Profile</span>
            <h2 style={{ fontSize: '24px', color: 'var(--success)', marginBottom: '8px' }}>
              {latestHealth ? 'Recent Metrics' : 'No Health Logs'}
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px', flex: 1 }}>
              {latestHealth ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><strong>BMI:</strong> {latestHealth.bmi}</div>
                  <div><strong>BMR:</strong> {latestHealth.bmr}</div>
                  <div><strong>Weight:</strong> {latestHealth.weight} kg</div>
                  <div><strong>Height:</strong> {latestHealth.height} cm</div>
                </div>
              ) : (
                'Start tracking your vitals to receive personalized wellness insights.'
              )}
            </div>
            <Link to="/health" className="glass-pill" style={{ background: '#fff', color: 'var(--success)', alignSelf: 'flex-start', textDecoration: 'none' }}>
              {latestHealth ? 'Log New Data' : 'Start Tracking'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>

        </div>

        {/* Dashboard Grid */}
        <h3 style={{ fontSize: '24px', fontWeight: 600, marginTop: '16px', color: 'var(--text-primary)' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <Link to="/diagnosis" className="card card-interactive" style={{ padding: '32px', background: '#e2e8f0', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">AI</span>
              <Thermometer size={24} color="var(--text-secondary)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-primary)', marginTop: 'auto' }}>Skin Diagnosis</h3>
          </Link>

          <Link to="/health" className="card card-interactive" style={{ padding: '32px', background: 'var(--success-light)', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">Monitoring</span>
              <Heart size={24} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--success)', marginTop: 'auto' }}>Health Tracking</h3>
          </Link>

          <Link to="/appointments" className="card card-interactive" style={{ padding: '32px', background: 'var(--brand-secondary-light)', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">Schedule</span>
              <Calendar size={24} color="var(--brand-secondary)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--brand-primary)', marginTop: 'auto' }}>Appointments</h3>
          </Link>

          <Link to="/reminders" className="card card-interactive" style={{ padding: '32px', background: 'var(--brand-primary-light)', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">Alerts</span>
              <Clock size={24} color="var(--brand-primary)" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--brand-primary)', marginTop: 'auto' }}>Reminders</h3>
          </Link>

          <Link to="/rentals" className="card card-interactive" style={{ padding: '32px', background: '#fef3c7', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">Equipment</span>
              <Truck size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: '#d97706', marginTop: 'auto' }}>Medical Rentals</h3>
          </Link>

          <Link to="/ngos" className="card card-interactive" style={{ padding: '32px', background: '#fee2e2', textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
            <div className="flex-between mb-4">
              <span className="badge badge-light">Support</span>
              <HeartHandshake size={24} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 500, color: '#dc2626', marginTop: 'auto' }}>Medical Resources</h3>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMenus = () => setMobileMenuOpen(false);

  return (
    <nav className="top-nav">
      <div className="container flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={20} color="var(--text-primary)" />
          </button>
          
          <Link to="/" className="nav-brand" onClick={closeMenus}>
            <Activity size={24} color="var(--brand-primary)" />
            <span className="hidden-mobile">MediTrack</span>
          </Link>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
           {isAuthenticated ? (
             <>
               <li><Link to="/" className="nav-item" onClick={closeMenus}>Dashboard</Link></li>
               {!user?.is_doctor && <li><Link to="/appointments" className="nav-item" onClick={closeMenus}>Appointments</Link></li>}
               <li>
                 <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '14px' }}>
                   Logout <LogOut size={14} style={{ marginLeft: '4px' }} />
                 </button>
               </li>
             </>
           ) : (
             <>
               <li><a href="/#features" className="nav-item" onClick={closeMenus}>Features</a></li>
               <li><a href="/#why-trust" className="nav-item" onClick={closeMenus}>Why Us</a></li>
               <li>
                 <Link to="/signup" className="btn btn-primary" onClick={closeMenus} style={{ padding: '8px 24px', fontSize: '14px' }}>
                   Get Started <span style={{ marginLeft: '4px', fontSize: '16px' }}>→</span>
                 </Link>
               </li>
             </>
           )}
        </ul>
      </div>
    </nav>
  );
};

const HomeWrapper = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="text-center mt-8">Loading application...</div>;
  if (!isAuthenticated) return <LandingPage />;
  if (user?.is_doctor) return <div className="container" style={{paddingTop: '120px'}}><AppointmentsPage /></div>;
  return <HomePage />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ position: 'relative' }}>
          <Navigation />
          <Routes>
            <Route path="/login" element={<div className="container" style={{paddingTop: '120px'}}><LoginPage /></div>} />
            <Route path="/signup" element={<div className="container" style={{paddingTop: '120px'}}><SignupPage /></div>} />
            
            <Route path="/" element={<HomeWrapper />} />
            
            <Route path="/diagnosis" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><SkinDiagnosisPage /></div></ProtectedRoute>} />
            <Route path="/health" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><HealthTrackerPage /></div></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><AppointmentsPage /></div></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><RemindersPage /></div></ProtectedRoute>} />
            <Route path="/rentals" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><RentalsPage /></div></ProtectedRoute>} />
            <Route path="/ngos" element={<ProtectedRoute><div className="container" style={{paddingTop: '120px'}}><NgosPage /></div></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
