import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Calendar, User, Clock, MapPin, Check, X, ShieldAlert, Sparkles, PlusCircle, Trash } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

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

  // Handle patient booking submission
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

  // Handle patient deleting appointment
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

  // Handle doctor action (Scheduled, Completed, Cancelled)
  const handleUpdateStatus = async (apptId, status) => {
    try {
      await client.post(`appointments/bookings/${apptId}/status/`, { status });
      setSuccess(`Appointment marked as ${status}.`);
      loadData();
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Handle doctor availability updates
  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdatingAvailability(true);

    try {
      await client.post('appointments/doctor/availability/', {
        available_days: workDays,
        location: workLocation,
        available_slots: TIME_SLOTS // Use default slots
      });
      setSuccess('Working days & location updated successfully!');
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

  if (fetching) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Syncing dashboard data...</div>;
  }

  // 🩺 DOCTOR DASHBOARD VIEW
  if (isDoctor) {
    return (
      <div className="fade-in">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
            Doctor Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
            Manage clinic bookings, configure availability parameters, and update patient statuses
          </p>
        </div>

        {/* Stats Grid */}
        {doctorStats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Total Bookings</div>
              <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '8px' }}>{doctorStats.total_consultations}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 600 }}>Confirmed</div>
              <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '8px' }}>{doctorStats.upcoming_appointments}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--brand-primary)', fontSize: '13px', fontWeight: 600 }}>Pending</div>
              <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '8px', color: 'var(--brand-primary)' }}>{doctorStats.pending_appointments}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Unique Patients</div>
              <div style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '8px' }}>{doctorStats.patient_count}</div>
            </div>
          </div>
        )}

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
          {/* Appointment list */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Consultation Log</h2>
            {appointments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No client bookings registered yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto' }}>
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
                      <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ marginTop: '2px' }} />
                        {appt.appointment_date} @ {appt.appointment_time.substring(0, 5)}
                      </div>
                    </div>
                    
                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={15} color="var(--brand-primary)" />
                      {appt.patient_detail?.username} ({appt.patient_detail?.email})
                    </div>

                    {appt.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Scheduled')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px', flex: 1 }}>
                          <Check size={14} /> Accept
                        </button>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', flex: 1 }}>
                          <X size={14} /> Decline
                        </button>
                      </div>
                    )}

                    {appt.status === 'Scheduled' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Completed')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', flex: 1, color: 'var(--success)', borderColor: 'var(--success)' }}>
                          Mark Completed
                        </button>
                        <button onClick={() => handleUpdateStatus(appt.id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', flex: 1, color: 'var(--error)' }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability settings */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Clinic Hours & Availability</h2>
            <form onSubmit={handleUpdateAvailability}>
              <div className="form-group">
                <label className="form-label">Clinic Location / Desk</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Desk 4, City Heart Clinic"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Active Working Days</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = workDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all var(--transition-fast)'
                        }}
                        onClick={() => handleDayToggle(day)}
                      >
                        {isSelected && <Check size={12} />}
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={updatingAvailability}>
                {updatingAvailability ? 'Saving settings...' : 'Update Clinic Profile'}
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
