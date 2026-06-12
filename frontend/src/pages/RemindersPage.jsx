import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Clock, PlusCircle, Trash, ShieldAlert, Sparkles, MessageSquare, Calendar } from 'lucide-react';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [duration, setDuration] = useState('1');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReminders = async () => {
    try {
      const res = await client.get('reminders/');
      setReminders(res.data);
    } catch (err) {
      console.error('Failed to fetch reminders');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!message || !remindAt || !duration) {
      setError('Please fill in all fields.');
      return;
    }

    const startDateTime = new Date(remindAt);
    if (startDateTime < new Date()) {
      setError('Start time must be in the future.');
      return;
    }

    setLoading(true);
    try {
      await client.post('reminders/', {
        message,
        remind_at: remindAt,
        reminder_duration: parseInt(duration)
      });
      setSuccess('Medication reminder scheduled successfully!');
      setMessage('');
      setRemindAt('');
      setDuration('1');
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.remind_at?.[0] || err.response?.data?.detail || 'Failed to create reminder.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await client.delete(`reminders/${id}/`);
      setSuccess('Reminder cancelled.');
      fetchReminders();
    } catch (err) {
      setError('Failed to delete reminder.');
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Medication Reminders
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Schedule automatic SMS & Email reminders for daily pills and prescriptions
        </p>
      </div>

      {error && (
        <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="badge-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <Sparkles size={16} />
          <span>{success}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Add reminder panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="var(--brand-primary)" />
            Schedule New Reminder
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Configure alerts for medication times
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Reminding Message</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="e.g. Take 2 units of Insulin before lunch"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">First Reminder Start Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
                min={new Date().toISOString().substring(0, 16)}
                disabled={loading}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label">Repeat Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                className="form-input"
                placeholder="e.g. 7"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Scheduling...' : 'Configure Reminder'}
            </button>
          </form>
        </div>

        {/* Reminders List panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Active Reminders</h2>

          {fetching ? (
            <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>Loading alerts log...</div>
          ) : reminders.length === 0 ? (
            <div style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>No scheduled reminders. Use the creation form to set one.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto' }}>
              {reminders.map((reminder) => (
                <div key={reminder.id} style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <Calendar size={13} />
                      {new Date(reminder.remind_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                      title="Cancel reminder"
                    >
                      <Trash size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'start', marginBottom: '12px' }}>
                    <MessageSquare size={16} color="var(--brand-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: '1.4' }}>{reminder.message}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <span>Duration: {reminder.reminder_duration} {reminder.reminder_duration === 1 ? 'day' : 'days'}</span>
                    <span className="badge badge-success">Queued</span>
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

export default RemindersPage;
