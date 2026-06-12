import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Activity, UserPlus, AlertCircle, Check } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SignupPage = () => {
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Doctor specific fields
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!username || !email || !phoneNumber || !password) {
      setError('Please fill in all basic fields.');
      return;
    }

    if (role === 'doctor') {
      if (!fullName || !specialty || selectedDays.length === 0) {
        setError('Please fill in all doctor details including availability days.');
        return;
      }
    }

    setLoading(true);

    try {
      if (role === 'patient') {
        await client.post('auth/register/', {
          username,
          email,
          phone_number: phoneNumber,
          password
        });
      } else {
        await client.post('auth/register/doctor/', {
          username,
          email,
          name: fullName,
          phone_number: phoneNumber,
          specialty,
          location,
          available_days: selectedDays,
          password
        });
      }

      // Automatically sign in upon registration
      const loginRes = await login(username, password);
      setLoading(false);

      if (loginRes.success) {
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.data) {
        const details = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
        setError(details || 'Registration failed.');
      } else {
        setError('Something went wrong during registration.');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px 24px'
    }}>
      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Activity size={32} color="var(--brand-primary)" />
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            MediTrack
          </span>
        </div>

        <h2 style={{ marginBottom: '8px', fontSize: '28px' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '15px' }}>
          Join the smart health network
        </p>

        {/* Role Toggles */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '32px'
        }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: role === 'patient' ? 'var(--bg-secondary)' : 'transparent',
              color: role === 'patient' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none'
            }}
            onClick={() => setRole('patient')}
            disabled={loading}
          >
            Patient Portal
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: role === 'doctor' ? 'var(--bg-secondary)' : 'transparent',
              color: role === 'doctor' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none'
            }}
            onClick={() => setRole('doctor')}
            disabled={loading}
          >
            Doctor Portal
          </button>
        </div>

        {error && (
          <div className="badge-error" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            fontSize: '14px',
            textAlign: 'left',
            whiteSpace: 'pre-line'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Common fields */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Pick a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +91XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Doctor fields */}
          {role === 'doctor' && (
            <div className="fade-in" style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialty</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cardiologist, Dermatologist"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinic Location / Office Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Suite 402, MedCare Plaza"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Available Days</label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '6px'
                }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'var(--brand-primary-hover)' : 'var(--bg-tertiary)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onClick={() => handleDayToggle(day)}
                        disabled={loading}
                      >
                        {isSelected && <Check size={12} />}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '32px', borderTop: role === 'doctor' ? '1px solid var(--border-color)' : 'none', marginTop: role === 'doctor' ? '24px' : '0', paddingTop: role === 'doctor' ? '24px' : '0' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
