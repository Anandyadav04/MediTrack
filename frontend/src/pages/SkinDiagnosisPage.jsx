import React, { useState, useRef } from 'react';
import client from '../api/client';
import { UploadCloud, FileImage, ShieldAlert, CheckCircle, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

const SkinDiagnosisPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Reset status
      setResult(null);
      setConfidence(null);
      setWarning(null);
      setError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setConfidence(null);
      setWarning(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or drag an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setWarning(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await client.post('skindiagnosis/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.warning) {
        setWarning(response.data.warning);
      } else {
        setResult(response.data.result);
        setConfidence(response.data.confidence);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Make sure you upload a valid image file.');
    } finally {
      setLoading(false);
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setConfidence(null);
    setWarning(null);
    setError(null);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', textAlign: 'left', marginBottom: '8px' }}>
          AI Skin Diagnosis
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
          Instantly classify skin diseases using our lightweight deep learning CNN classifier model.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left pane: Upload Area */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Upload Scan Image</h2>
          
          <form onSubmit={handleSubmit}>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-tertiary)',
                transition: 'border-color var(--transition-fast)',
                marginBottom: '24px',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={loading}
              />
              
              {previewUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'contain',
                      marginBottom: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <FileImage size={16} />
                    <span>{selectedFile.name}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)'
                  }}>
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>Click to upload or drag & drop</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>PNG, JPG or JPEG (Max 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {previewUrl && (
                <button
                  type="button"
                  onClick={resetUploader}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
                    Analyzing Scan...
                  </>
                ) : 'Analyze Image'}
              </button>
            </div>
          </form>
        </div>

        {/* Right pane: Results */}
        <div className="glass-panel" style={{ padding: '32px', minHeight: '340px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Diagnostic Output</h2>

          {/* Initial state */}
          {!loading && !result && !warning && !error && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              gap: '12px'
            }}>
              <HelpCircle size={48} strokeWidth={1.5} color="var(--text-muted)" />
              <p style={{ fontSize: '15px' }}>Upload an image and run diagnostics to see results</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--brand-primary)',
                animation: 'spin 1s linear infinite'
              }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600 }}>Executing Model Inference</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Processing tensors and class probabilities...</p>
              </div>
              
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Prediction Result */}
          {!loading && result && (
            <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--success)',
                marginBottom: '16px',
                fontWeight: 600
              }}>
                <CheckCircle size={20} />
                <span>Prediction Complete</span>
              </div>
              
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Detected Disease
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', margin: '8px 0 24px' }}>
                {result.replace(/-/g, ' ')}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Model Confidence</span>
                  <span style={{ fontWeight: 600 }}>{confidence}%</span>
                </div>
                {/* Confidence Bar */}
                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${confidence}%`,
                    backgroundColor: 'var(--brand-primary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>

              <div className="badge-warning" style={{
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginTop: '32px',
                fontSize: '13px',
                textAlign: 'left'
              }}>
                <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Important:</strong> AI classifications are for informational reference only. If symptoms persist, consult a professional dermatologist.
                </span>
              </div>
            </div>
          )}

          {/* Model Warning */}
          {!loading && warning && (
            <div className="fade-in" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <ShieldAlert size={48} color="var(--warning)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Analysis Warning</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
                {warning}
              </p>
              <button onClick={resetUploader} className="btn btn-secondary" style={{ marginTop: '24px', padding: '10px 20px' }}>
                Try Another Image
              </button>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="fade-in" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              <ShieldAlert size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Prediction Failed</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {error}
              </p>
              <button onClick={resetUploader} className="btn btn-secondary" style={{ marginTop: '24px', padding: '10px 20px' }}>
                Reset Uploader
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SkinDiagnosisPage;
