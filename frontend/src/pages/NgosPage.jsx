import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { ShieldAlert, Globe, Mail, Phone, Clock, MessageSquare, Star, ArrowLeft, Send, Sparkles, Search, MapPin } from 'lucide-react';

const NgosPage = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const fetchNgos = async () => {
    try {
      const res = await client.get('ngos/');
      setNgos(res.data);
      if (selectedNgo) {
        const updatedNgo = res.data.find(n => n.id === selectedNgo.id);
        if (updatedNgo) setSelectedNgo(updatedNgo);
      }
    } catch (err) {
      console.error('Failed to fetch NGOs list');
      setError('Failed to load NGO directory.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const handleLeaveFeedback = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setSubmittingFeedback(true);
    setError('');
    setFeedbackSuccess('');
    
    try {
      await client.post(`ngos/${selectedNgo.id}/feedback/`, {
        rating: parseInt(rating),
        comment
      });
      setFeedbackSuccess('Thank you for your review!');
      setComment('');
      setRating(5);
      fetchNgos();
    } catch (err) {
      setError(err.response?.data?.rating?.[0] || 'Failed to submit review.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (fetching && ngos.length === 0) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Syncing NGO directory logs...</div>;
  }

  // 📖 NGO DETAIL VIEW
  if (selectedNgo) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'left' }}>
          <button
            onClick={() => { setSelectedNgo(null); setError(''); setFeedbackSuccess(''); }}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}
          >
            <ArrowLeft size={16} /> Back to Directory
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* NGO Info Panel */}
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '6px' }}>{selectedNgo.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontWeight: 600 }}>
                <Star size={18} fill="currentColor" />
                <span>{selectedNgo.average_rating} Average Rating</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
              {selectedNgo.description || 'No description provided.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Services & Assistance</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{selectedNgo.services}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--brand-primary)" />
                <span>Working Hours: {selectedNgo.working_hours || 'Not Specified'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--brand-primary)" />
                <span>Phone: {selectedNgo.contact_number}</span>
              </div>
              {selectedNgo.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="var(--brand-primary)" />
                  <a href={`mailto:${selectedNgo.email}`} style={{ color: 'inherit' }}>{selectedNgo.email}</a>
                </div>
              )}
              {selectedNgo.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} color="var(--brand-primary)" />
                  <a href={selectedNgo.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Review Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Post Feedback form */}
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Leave Feedback</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>Share your experience with this resource</p>
              
              {feedbackSuccess && (
                <div className="badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '14px' }}>
                  <Sparkles size={16} />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLeaveFeedback}>
                <div className="form-group">
                  <label className="form-label">Review Rating</label>
                  <div style={{ display: 'flex', gap: '8px', marginTicks: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => setRating(star)}
                        disabled={submittingFeedback}
                      >
                        <Star size={24} fill={star <= rating ? 'var(--warning)' : 'none'} color={star <= rating ? 'var(--warning)' : 'var(--text-muted)'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Feedback Comment</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Provide comment details..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submittingFeedback}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingFeedback}>
                  <Send size={16} /> Submit Feedback
                </button>
              </form>
            </div>

            {/* Past Feedbacks Log */}
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="var(--brand-primary)" />
                Patient Reviews ({selectedNgo.feedbacks?.length || 0})
              </h3>

              {!selectedNgo.feedbacks || selectedNgo.feedbacks.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No patient reviews submitted yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '360px', overflowY: 'auto' }}>
                  {selectedNgo.feedbacks.map((fb) => (
                    <div key={fb.id} style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 600 }}>@{fb.username}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= fb.rating ? 'var(--warning)' : 'none'} color={s <= fb.rating ? 'var(--warning)' : 'var(--text-muted)'} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{fb.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Filter list of NGOs
  const filteredNgos = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ngo.services && ngo.services.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation =
      ngo.location && ngo.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // 📋 NGO LIST VIEW
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Healthcare NGOs Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Find, review, and connect with healthcare NGOs offering resources and free assistance programs
        </p>
      </div>

      {error && (
        <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="glass-panel" style={{
        padding: '20px',
        marginBottom: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        
        <div style={{ position: 'relative', width: '100%' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <MapPin size={18} />
          </span>
          <input
            type="text"
            className="form-input"
            placeholder="Filter by location (e.g. City)..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '24px'
      }}>
        {filteredNgos.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3>No NGOs Found</h3>
            <p style={{ marginTop: '8px' }}>Try adjusting your search query or location filter.</p>
          </div>
        ) : (
          filteredNgos.map((ngo) => (
          <div
            key={ngo.id}
            className="glass-panel"
            onClick={() => setSelectedNgo(ngo)}
            style={{
              padding: '24px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--brand-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{ngo.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>
                  <Star size={14} fill="currentColor" />
                  <span>{ngo.average_rating}</span>
                </div>
              </div>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Clock size={14} />
                Hours: {ngo.working_hours || 'Not Specified'}
              </p>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                {ngo.description ? (ngo.description.substring(0, 100) + '...') : 'No description provided.'}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>📍 {ngo.location}</span>
              <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>View Details →</span>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default NgosPage;
