import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Calendar, User, Clock, MapPin, Check, X, ShieldAlert, Sparkles, PlusCircle, Trash, Stethoscope, Sliders, CheckSquare, Square } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const AppointmentsPage = () => {
  const { user } = useAuth();
  const isDoctor = user?.is_doctor;

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Patient booking form state
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Doctor availability state
  const [doctorStats, setDoctorStats] = useState(null);
  const [workLocation, setWorkLocation] = useState('');
  const [workDays, setWorkDays] = useState([]);
  const [workSlots, setWorkSlots] = useState([]);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const loadData = async () => {
    setFetching(true);
    try {
      // Load appointments
      const apptsRes = await client.get('appointments/bookings/');
      setAppointments(apptsRes.data);

      if (isDoctor) {
        // Load doctor stats
        const statsRes = await client.get('appointments/doctor/dashboard/');
        setDoctorStats(statsRes.data.stats);
        setWorkLocation(statsRes.data.availability.location || '');
        
        const daysStr = statsRes.data.availability.available_days || '';
        setWorkDays(daysStr ? daysStr.split(', ') : []);

        const slotsObj = statsRes.data.availability.available_times || {};
        // Get slots list from any of the day keys or fall back to defaults
        const slotsList = Object.values(slotsObj)[0] || DEFAULT_TIME_SLOTS;
        setWorkSlots(slotsList);
      } else {
        // Load doctors list
        const docsRes = await client.get('appointments/doctors/');
        setDoctors(docsRes.data);
      }
    } catch (err) {
      console.error('Failed to load appointments data');
      setError('Failed to sync scheduler server logs.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isDoctor]);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctorId || !bookingDate) {
        setAvailableSlots([]);
        return;
      }
      setFetchingSlots(true);
      try {
        const res = await client.post('appointments/availability/', {
          doctor_id: selectedDoctorId,
          appointment_date: bookingDate
        });
        setAvailableSlots(res.data.available_times || []);
        setSelectedSlot('');
      } catch (err) {
        console.error('Failed to load slots');
      } finally {
        setFetchingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDoctorId, bookingDate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDoctorId || !bookingDate || !selectedSlot) {
      setError('Please select a doctor, date, and available slot.');
      return;
    }

    setSubmittingBooking(true);
    try {
      await client.post('appointments/bookings/', {
        doctor: parseInt(selectedDoctorId),
        appointment_date: bookingDate,
        appointment_time: selectedSlot
      });
      setSuccess('Appointment request submitted successfully!');
      setSelectedDoctorId('');
      setBookingDate('');
      setSelectedSlot('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking request failed.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleDeleteAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await client.delete(`appointments/bookings/${apptId}/`);
      setSuccess('Appointment cancelled.');
      loadData();
    } catch (err) {
      setError('Failed to cancel appointment.');
    }
  };

  const handleUpdateStatus = async (apptId, status) => {
    try {
      await client.post(`appointments/bookings/${apptId}/status/`, { status });
      setSuccess(`Appointment status successfully updated to ${status}.`);
      loadData();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdatingAvailability(true);

    try {
      await client.post('appointments/doctor/availability/', {
        available_days: workDays,
        location: workLocation,
        available_slots: workSlots
      });
      setSuccess('Working days, location, and hours updated successfully!');
      loadData();
    } catch (err) {
      setError('Failed to update availability.');
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleDayToggle = (day) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const handleSlotToggle = (slot) => {
    if (workSlots.includes(slot)) {
      setWorkSlots(workSlots.filter((s) => s !== slot));
    } else {
      setWorkSlots([...workSlots, slot]);
    }
  };

  if (fetching) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Syncing scheduler logs...</div>;
  }

  // 🩺 UPGRADED DOCTOR DASHBOARD VIEW
  if (isDoctor) {
    const doctorObj = user;
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Welcome Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-secondary)'
            }}>
              <Stethoscope size={36} />
            </div>
            <div>
              <span className="badge badge-success" style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: 'var(--success)', marginBottom: '8px' }}>
                Healthcare Provider Portal
              </span>
              <h1 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '6px' }}>Dr. {doctorObj?.username || 'Practitioner'}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Stethoscope size={14} /> Medical Practitioner
                </span>
                {workLocation && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {workLocation}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '16px 24px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Clock size={13} /> Active Schedule
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
              {workDays.length > 0 ? workDays.join(', ') : 'No schedule set'}
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="badge-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Statistics KPI Row */}
        {doctorStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Bookings</span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>{doctorStats.total_consultations}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <Calendar size={20} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-primary)' }}>Pending Approval</span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px', color: 'var(--brand-primary)' }}>{doctorStats.pending_appointments}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                <Clock size={20} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>Upcoming Scheduled</span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px', color: 'var(--success)' }}>{doctorStats.upcoming_appointments}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                <Check size={20} />
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Unique Patients</span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>{doctorStats.patient_count}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(148, 163, 184, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left panel: Consultation Log */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '6px' }}>Consultation Schedule</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>Manage patient requests and update consultation status</p>
            
            {appointments.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No client bookings registered yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
                {appointments.map((appt) => (
                  <div key={appt.id} style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          color: 'var(--brand-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>
                          {appt.patient_detail?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{appt.patient_detail?.username}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{appt.patient_detail?.email}</div>
                        </div>
                      </div>
                      <span className="badge" style={{
                        backgroundColor: appt.status === 'Scheduled' ? 'rgba(16, 185, 129, 0.15)' :
                                         appt.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' :
                                         appt.status === 'Completed' ? 'rgba(99, 102, 241, 0.15)' :
                                         'rgba(239, 68, 68, 0.15)',
                        color: appt.status === 'Scheduled' ? 'var(--success)' :
                               appt.status === 'Pending' ? 'var(--warning)' :
                               appt.status === 'Completed' ? 'var(--brand-primary)' :
                               'var(--error)'
                      }}>{appt.status}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', padding: '8px 0', borderBlock: '1px solid var(--border-color)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {appt.appointment_date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {appt.appointment_time.substring(0, 5)}</span>
                    </div>

                    {appt.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Scheduled')} className="btn btn-primary" style={{ padding: '8px', fontSize: '13px', flex: 1, gap: '4px' }}>
                          <Check size={14} /> Accept Request
                        </button>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '13px', flex: 1, color: 'var(--error)', gap: '4px' }}>
                          <X size={14} /> Decline
                        </button>
                      </div>
                    )}

                    {appt.status === 'Scheduled' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Completed')} className="btn btn-primary" style={{ padding: '8px', fontSize: '13px', flex: 1, backgroundColor: 'var(--success)', border: 'none', gap: '4px' }}>
                          <Check size={14} /> Complete Visit
                        </button>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '13px', flex: 1, color: 'var(--error)', gap: '4px' }}>
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Profile Availability Customizer */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="var(--brand-primary)" />
              Practice Settings
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>Configure working hours, location details, and slots</p>

            <form onSubmit={handleUpdateAvailability}>
              <div className="form-group">
                <label className="form-label">Practice Location / Desk</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Room 402, City General Hospital"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  required
                />
              </div>

              {/* Working days checkboxes */}
              <div className="form-group">
                <label className="form-label">Active Working Days</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = workDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        style={{
                          padding: '10px 8px',
                          fontSize: '13px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onClick={() => handleDayToggle(day)}
                      >
                        {isSelected ? <CheckSquare size={14} color="var(--brand-primary)" /> : <Square size={14} />}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom working hour slots */}
              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Active Hour Slots</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {DEFAULT_TIME_SLOTS.map((slot) => {
                    const isSelected = workSlots.includes(slot);
                    return (
                      <button
                        type="button"
                        key={slot}
                        style={{
                          padding: '8px 4px',
                          fontSize: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onClick={() => handleSlotToggle(slot)}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={updatingAvailability}>
                {updatingAvailability ? 'Saving practice details...' : 'Save Practice Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 🏥 PATIENT BOOKING VIEW
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Book Appointment
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Find professional doctors, select hours, and schedule consultations in seconds
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
        {/* Book Appointment form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="var(--brand-primary)" />
            New Appointment Request
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Select your provider and select date parameters
          </p>

          <form onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label className="form-label">Dermatologist / Practitioner</label>
              <select
                className="form-input"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={submittingBooking}
              >
                <option value="">-- Select Provider --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Date</label>
              <input
                type="date"
                className="form-input"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={submittingBooking}
              />
            </div>

            {/* Time Slot Picker */}
            {selectedDoctorId && bookingDate && (
              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Available Time Slots</label>
                {fetchingSlots ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Querying slot logs...</div>
                ) : availableSlots.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--error)' }}>No available time slots on this day.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          style={{
                            padding: '10px 4px',
                            fontSize: '13px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                            backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                            color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={submittingBooking || !selectedSlot}
            >
              {submittingBooking ? 'Submitting request...' : 'Reserve Consultation Slot'}
            </button>
          </form>
        </div>

        {/* Patient Appointments History list */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Your Appointments</h2>
          {appointments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No scheduled consultations recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '480px', overflowY: 'auto' }}>
              {appointments.map((appt) => (
                <div key={appt.id} style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge" style={{
                      backgroundColor: appt.status === 'Scheduled' ? 'rgba(16, 185, 129, 0.15)' :
                                       appt.status === 'Pending' ? 'rgba(99, 102, 241, 0.15)' :
                                       appt.status === 'Completed' ? 'rgba(148, 163, 184, 0.15)' :
                                       'rgba(239, 68, 68, 0.15)',
                      color: appt.status === 'Scheduled' ? 'var(--success)' :
                             appt.status === 'Pending' ? 'var(--brand-primary)' :
                             appt.status === 'Completed' ? 'var(--text-secondary)' :
                             'var(--error)'
                    }}>{appt.status}</span>
                    <button
                      onClick={() => handleDeleteAppointment(appt.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                      title="Cancel booking"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>
                    Dr. {appt.doctor_detail?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {appt.doctor_detail?.specialty}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{appt.appointment_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>{appt.appointment_time.substring(0, 5)}</span>
                    </div>
                    {appt.doctor_detail?.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} />
                        <span>{appt.doctor_detail?.location}</span>
                      </div>
                    )}
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

export default AppointmentsPage;
