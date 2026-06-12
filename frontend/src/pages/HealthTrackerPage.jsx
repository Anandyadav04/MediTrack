import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Heart, PlusCircle, AlertCircle, Calendar, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';

const HealthTrackerPage = () => {
  const [records, setRecords] = useState([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await client.get('health/');
      setRecords(res.data);
    } catch (err) {
      console.error('Failed to load health records');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'var(--warning)' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'var(--success)' };
    if (bmi < 30) return { label: 'Overweight', color: 'var(--warning)' };
    return { label: 'Obese', color: 'var(--error)' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!weight || !height || !age) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await client.post('health/', {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        gender
      });
      setSuccess('Health record saved successfully!');
      setWeight('');
      setHeight('');
      setAge('');
      // Reload records list
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit health record.');
    } finally {
      setLoading(false);
    }
  };

  const latestRecord = records[0];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Health Monitoring
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Calculate and track your Body Mass Index (BMI) and Basal Metabolic Rate (BMR) metrics
        </p>
      </div>

      {/* Overview stats */}
      {latestRecord && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* BMI card */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Body Mass Index (BMI)</span>
              <span className="badge" style={{
                backgroundColor: getBmiCategory(latestRecord.bmi).color + '1a',
                color: getBmiCategory(latestRecord.bmi).color
              }}>
                {getBmiCategory(latestRecord.bmi).label}
              </span>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {latestRecord.bmi}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Weight category based on height/weight ratio
            </p>
          </div>

          {/* BMR card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Basal Metabolic Rate (BMR)</span>
              <Sparkles size={18} color="var(--brand-primary)" />
            </div>
            <div style={{ fontSize: '42px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)' }}>
              {latestRecord.bmr} <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)' }}>kcal/day</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Daily calories required at rest
            </p>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Form panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="var(--brand-primary)" />
            Log New Metrics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Enter your details to compute current health statistics
          </p>

          {error && (
            <div className="badge-error" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'left'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="badge-success" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'left'
            }}>
              <Sparkles size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age (years)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Gender</label>
              <select
                className="form-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={loading}
                style={{ appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Saving Record...' : (
                <>
                  <PlusCircle size={18} />
                  Calculate & Save
                </>
              )}
            </button>
          </form>
        </div>

        {/* History panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px' }}>History Log</h2>
            <button
              onClick={fetchRecords}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Refresh log"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {fetching ? (
            <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading history records...</div>
          ) : records.length === 0 ? (
            <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>No records logged yet. Fill out the form to get started.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
              {records.map((record) => (
                <div
                  key={record.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <Calendar size={13} />
                      {new Date(record.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>
                      {record.weight}kg / {record.height}cm ({record.age}y, {record.gender})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {record.bmi} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>BMI</span>
                    </div>
                    <div style={{ fontSize: '11px', color: getBmiCategory(record.bmi).color, fontWeight: 600 }}>
                      {getBmiCategory(record.bmi).label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerPage;
