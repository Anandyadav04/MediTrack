import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { ShieldAlert, Phone, HelpCircle, AlertCircle, Search } from 'lucide-react';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await client.get('rentals/');
        setRentals(res.data);
      } catch (err) {
        console.error('Failed to fetch rentals');
        setError('Failed to load rental catalog.');
      } finally {
        setFetching(false);
      }
    };
    fetchRentals();
  }, []);

  if (fetching) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Syncing equipment rentals catalog...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          Medical Equipment Rentals
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Rent verified healthcare equipment (wheelchairs, beds, crutches) from local coordinators
        </p>
      </div>

      {error && (
        <div className="badge-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {rentals.length > 0 && (
        <div className="glass-panel" style={{
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="Search equipment by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>
      )}

      {rentals.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <HelpCircle size={48} strokeWidth={1.5} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>No Equipment Listings Found</h3>
          <p style={{ marginTop: '8px' }}>Check back later for updated local warehouse inventory logs.</p>
        </div>
      ) : (
        (() => {
          const filteredRentals = rentals.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredRentals.length === 0) {
            return (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>No Matching Equipment Found</h3>
                <p style={{ marginTop: '8px' }}>Try adjusting your search keywords.</p>
              </div>
            );
          }
          return (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginTop: '24px'
            }}>
              {filteredRentals.map((item) => (
                <div key={item.id} className="glass-panel" style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left'
                }}>
                  {item.image && (
                    <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                      <img
                        src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform var(--transition-normal)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{item.name}</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Cost / Day</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-heading)' }}>
                          ₹{parseFloat(item.cost).toFixed(2)}
                        </span>
                      </div>
                      
                      <a
                        href={`tel:${item.phone_number}`}
                        className="btn btn-primary"
                        style={{ padding: '10px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Phone size={14} />
                        Call Rent Desk
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
};

export default RentalsPage;
