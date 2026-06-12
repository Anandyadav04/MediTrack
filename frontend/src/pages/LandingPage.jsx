import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, UserCheck, Smartphone, ChevronLeft, ChevronRight, Rocket, Star, Heart, Truck, HeartHandshake } from 'lucide-react';

const TESTIMONIALS = [
  {
    content: "MediTrack's AI skin detection helped me identify a potential issue months before my scheduled dermatologist appointment. Early detection made all the difference!",
    author: "Sarah Johnson",
    role: "Patient • 6 months user",
    avatar: "SJ"
  },
  {
    content: "As someone with multiple medications, the reminder system is a lifesaver. The SMS alerts ensure I never miss a dose. Truly revolutionary!",
    author: "Michael Rodriguez",
    role: "Chronic Care Patient",
    avatar: "MR"
  },
  {
    content: "The appointment booking system saved me hours of phone calls. Being able to see doctor availability and book instantly has transformed my healthcare experience.",
    author: "Emma Patel",
    role: "Busy Professional",
    avatar: "EP"
  }
];

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* 🚀 Hero Section */}
      <section style={{
        padding: '60px 0',
        textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '80px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="badge badge-success" style={{ width: 'fit-content', gap: '6px' }}>
            <Star size={12} fill="currentColor" />
            <span>AI-Powered Health Companion</span>
          </div>
          <h1 style={{ fontSize: '48px', lineHeight: 1.15, fontWeight: 800 }}>
            Your Smart Digital Healthcare Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.5, maxWidth: '540px' }}>
            Revolutionizing healthcare with intelligent monitoring, deep learning skin diagnosis, and seamless appointment scheduling.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 28px' }}>
              <Rocket size={18} />
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
              Access Dashboard
            </Link>
          </div>
        </div>
        
        {/* Animated illustration frame */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--glass-bg), rgba(99, 102, 241, 0.05))',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              backgroundColor: 'var(--success)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Heart size={20} fill="currentColor" />
            </div>
            <Activity size={96} strokeWidth={1} color="var(--brand-primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Live Health Tracking</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Instant diagnostic scores and real-time alerts.
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Stats Counter */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-primary)' }}>10,000+</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>Active Patients</div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--brand-secondary)' }}>5,000+</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>Diagnoses Made</div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--success)' }}>98%</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>Inference Accuracy</div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>24/7</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>System Availability</div>
        </div>
      </section>

      {/* ⚡ Features Grid */}
      <section id="features" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Smart Health Features</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '600px', marginInline: 'auto' }}>
          Empower yourself with intelligent features designed to make healthcare management simple, fast, and secure.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <Link to="/diagnosis" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI Skin Diagnosis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Upload clinical pictures of skin irritations for instant, lightweight deep learning classification.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>
          
          <Link to="/appointments" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Smart Scheduling</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Select clinic slots, browse verified practitioners, and submit pending appointment requests instantly.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>

          <Link to="/health" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Health Monitoring</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Log health details to compute current BMI/BMR statistics and maintain history charts over time.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>

          <Link to="/reminders" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Medication Reminders</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Configure automatic medication notifications delivered directly via Twilio SMS and email logs.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>

          <Link to="/rentals" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Equipment Rentals</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Rent essential medical equipment like wheelchairs, oxygen cylinders, and beds from verified local coordinators.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>

          <Link to="/ngos" className="glass-panel glass-panel-interactive" style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'inherit' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Medical Resources</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Connect with verified health NGOs offering free check-ups, diagnostic camps, and financial assistance.
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '14px', marginTop: '16px' }}>
              Check Now →
            </span>
          </Link>
        </div>
      </section>

      {/* 🛡️ Benefits Section */}
      <section id="why-trust" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px' }}>Why Trust MediTrack?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Shield size={40} color="var(--brand-primary)" />
            <h4 style={{ fontSize: '18px' }}>Secure Data</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>All logs are encrypted with enterprise-grade protection.</p>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Zap size={40} color="var(--brand-secondary)" />
            <h4 style={{ fontSize: '18px' }}>Instant Results</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Access calculations and diagnostics in seconds.</p>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <UserCheck size={40} color="var(--success)" />
            <h4 style={{ fontSize: '18px' }}>Verified Schedules</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Direct confirmation and emails with qualified practitioners.</p>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Smartphone size={40} color="var(--text-primary)" />
            <h4 style={{ fontSize: '18px' }}>Responsive Design</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Cross-platform dashboard compatible across devices.</p>
          </div>
        </div>
      </section>

      {/* 💬 Testimonials */}
      <section id="testimonials" className="glass-panel" style={{ padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>What Our Users Say</h2>
        
        <div style={{ minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{
            fontSize: '18px',
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            marginBottom: '24px',
            maxWidth: '800px',
            marginInline: 'auto'
          }}>
            "{TESTIMONIALS[activeTestimonial].content}"
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>
              {TESTIMONIALS[activeTestimonial].avatar}
            </div>
            <div style={{ textAlign: 'left' }}>
              <h5 style={{ fontSize: '15px', fontWeight: 600 }}>{TESTIMONIALS[activeTestimonial].author}</h5>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{TESTIMONIALS[activeTestimonial].role}</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '32px'
        }}>
          <button onClick={prevTestimonial} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextTestimonial} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* 📢 Bottom CTA */}
      <section className="glass-panel" style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))',
        color: '#ffffff',
        border: 'none'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#ffffff' }}>Ready to Take Control of Your Health?</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '32px', maxWidth: '600px', marginInline: 'auto' }}>
          Join thousands of users who trust MediTrack for their daily health monitoring and medical coordination.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-secondary" style={{ padding: '12px 24px', backgroundColor: '#ffffff', color: 'var(--brand-primary)', border: 'none' }}>
            Create Free Account
          </Link>
          <Link to="/login" className="btn" style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.4)', color: '#ffffff' }}>
            Log In
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;
