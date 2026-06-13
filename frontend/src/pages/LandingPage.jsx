import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Calendar, Shield, Thermometer, Clock, Truck, HeartHandshake, Heart, User } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';

const LandingPage = () => {
  return (
    <div className="flex-col gap-0">
      
      {/* 🚀 Hero Section (MediTrack Content) */}
      <section className="hero-wrapper" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-content">
          
          {/* Floating Badges */}
          <div style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 10 }}>
            <span className="glass-pill">
              <span style={{ color: '#0ea5e9', fontSize: '18px' }}>•</span> AI Skin Diagnosis
            </span>
          </div>

          <div style={{ position: 'absolute', top: '25%', right: '25%', zIndex: 10 }}>
            <span className="glass-pill">
              <span style={{ color: 'var(--success)', fontSize: '18px' }}>•</span> Live Tracking
            </span>
          </div>

          <div style={{ position: 'absolute', top: '50%', right: '10%', zIndex: 10 }}>
            <span className="glass-pill">
              <span style={{ color: '#f59e0b', fontSize: '18px' }}>•</span> Equipment Rentals
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '20%', right: '15%', zIndex: 10 }}>
            <Link to="/appointments" className="glass-pill" style={{ padding: '12px 20px', display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff7eb3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={12} color="#fff" /></div>
                <span>Book Appointment</span>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {/* Main Text Area */}
          <div style={{ maxWidth: '600px', marginTop: '10vh' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
              AI-POWERED HEALTH COMPANION
            </p>
            <h1 style={{ fontSize: '72px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.05, textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              Your Smart <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', verticalAlign: 'middle', margin: '0 8px' }}>*</span><br />
              Digital Health<br />
              Portal
            </h1>
            
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '24px', marginTop: '40px' }}>
              <Link to="/signup" className="glass-pill" style={{ padding: '12px 24px', cursor: 'pointer' }}>
                Get Started Free <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Link>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={18} color="#fff" /></div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={18} color="#fff" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 Why Trust MediTrack Section */}
      <section className="container section-padding">
        <div className="grid-cols-2" style={{ alignItems: 'flex-start', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '64px', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
            Why Trust<br/>MediTrack?
          </h2>
          <div style={{ paddingTop: '12px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '400px' }}>
              Revolutionizing healthcare with intelligent monitoring, deep learning skin diagnosis, and seamless appointment scheduling.
            </p>
          </div>
        </div>

        <div className="grid-cols-2" style={{ gap: '60px' }}>
          <div>
            <div style={{ fontSize: '48px', color: 'var(--border-color)', lineHeight: 1, marginBottom: '16px', fontFamily: 'serif' }}>"</div>
            <p style={{ fontSize: '24px', fontWeight: 500, lineHeight: 1.4, color: 'var(--text-primary)', marginBottom: '32px' }}>
              Empower yourself with intelligent features designed to make healthcare management simple, fast, and secure. All logs are encrypted with enterprise-grade protection.
            </p>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', fontWeight: 600, fontSize: '16px', cursor: 'pointer', color: 'var(--text-primary)' }}>
              Access Dashboard
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={16} style={{ transform: 'rotate(-45deg)' }} />
              </div>
            </Link>
          </div>
          
          <div style={{ position: 'relative' }}>
             <div className="card" style={{ padding: '60px', textAlign: 'center', background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <Shield size={48} color="var(--brand-primary)" style={{ marginBottom: '24px' }} />
               <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>Secure & Instant Health Results</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '40px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                 <span>Security</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Explore <ArrowRight size={14} /></span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* ⚡ Features Grid */}
      <section className="container mb-8">
        <h2 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>Smart Health Features</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          
          {/* Diagnosis */}
          <Link to="/diagnosis" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: '#e2e8f0', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <span className="badge badge-light">AI</span>
              <Thermometer size={24} color="var(--text-secondary)" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>Skin Diagnosis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Upload clinical pictures for instant deep learning classification.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1, color: 'var(--text-primary)' }}>+</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Appointments */}
          <Link to="/appointments" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: 'var(--brand-secondary-light)', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <User size={24} color="var(--brand-secondary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Doctors</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Verified practitioners</div>
                </div>
              </div>
              <span className="glass-pill" style={{ fontSize: '12px' }}>Schedule +</span>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: 'var(--brand-primary)', marginBottom: '16px', lineHeight: 1.2 }}>Smart Scheduling</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Select slots and book pending requests instantly.</p>
            </div>
          </Link>

          {/* Health Tracking */}
          <Link to="/health" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: 'var(--success-light)', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <span className="badge badge-light">Monitoring</span>
              <Activity size={24} color="var(--success)" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: 'var(--success)', marginBottom: '8px' }}>Health Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Log health details to compute current BMI/BMR statistics.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1, color: 'var(--success)' }}>+</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Reminders */}
          <Link to="/reminders" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: 'var(--brand-primary-light)', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <span className="badge badge-light">Alerts</span>
              <Clock size={24} color="var(--brand-primary)" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: 'var(--brand-primary)', marginBottom: '8px' }}>Medication Reminders</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Configure automatic SMS notifications for prescriptions.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1, color: 'var(--brand-primary)' }}>+</span>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Rentals */}
          <Link to="/rentals" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: '#fef3c7', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <span className="badge badge-light">Equipment</span>
              <Truck size={24} color="#d97706" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: '#d97706', marginBottom: '8px' }}>Medical Rentals</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Rent essential items like wheelchairs and oxygen cylinders.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1, color: '#d97706' }}>+</span>
                </div>
              </div>
            </div>
          </Link>

          {/* NGOs */}
          <Link to="/ngos" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: '#fee2e2', minHeight: '320px', textDecoration: 'none' }}>
            <div className="flex-between">
              <span className="badge badge-light">Support</span>
              <HeartHandshake size={24} color="#dc2626" />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 500, color: '#dc2626', marginBottom: '8px' }}>Medical Resources</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Connect with health NGOs for check-ups and assistance.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '24px', lineHeight: 1, color: '#dc2626' }}>+</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ padding: '60px 24px', borderTop: '1px solid var(--border-color)', marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>&copy; {new Date().getFullYear()} MediTrack. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '16px' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Contact Us</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
