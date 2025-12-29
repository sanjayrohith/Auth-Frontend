import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { RefreshCw, Smartphone, CheckCircle2, Clock } from 'lucide-react';

const QRLogin = ({ onSuccess }) => {
  const [qrData, setQrData] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('pending'); // pending, scanning, success, expired
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    generateQRSession();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setStatus('expired');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Poll for QR scan status
  useEffect(() => {
    if (status !== 'pending' && status !== 'scanning') return;

    const pollInterval = setInterval(async () => {
      try {
        // In production, poll your backend
        const response = await checkQRStatus(sessionId);
        if (response.status === 'authenticated') {
          setStatus('success');
          clearInterval(pollInterval);
          setTimeout(() => onSuccess(), 1500);
        } else if (response.status === 'scanning') {
          setStatus('scanning');
        }
      } catch (error) {
        console.log('Polling for QR status...');
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [sessionId, status, onSuccess]);

  const generateQRSession = () => {
    // Generate unique session ID
    const newSessionId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // QR data contains session info for mobile app
    const qrPayload = JSON.stringify({
      type: 'smart_auth_login',
      sessionId: newSessionId,
      timestamp: Date.now(),
      domain: window.location.hostname,
    });
    
    setQrData(qrPayload);
    setStatus('pending');
    setCountdown(120);
  };

  const checkQRStatus = async (sid) => {
    // Simulated response - in production, call your backend
    // return await fetch(`/api/qr-status/${sid}`).then(r => r.json());
    return { status: 'pending' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="qr-login-section">
      <div className="qr-container">
        {status === 'success' ? (
          <motion.div 
            className="qr-success"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle2 size={80} className="success-icon" />
            <p>Authentication successful!</p>
          </motion.div>
        ) : status === 'expired' ? (
          <div className="qr-expired">
            <p>QR Code expired</p>
            <button className="refresh-btn" onClick={generateQRSession}>
              <RefreshCw size={18} />
              <span>Generate new QR</span>
            </button>
          </div>
        ) : (
          <>
            <motion.div 
              className="qr-code-wrapper"
              animate={status === 'scanning' ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, repeat: status === 'scanning' ? Infinity : 0 }}
            >
              <QRCodeSVG 
                value={qrData}
                size={180}
                level="H"
                includeMargin={true}
                bgColor="transparent"
                fgColor="#ffffff"
              />
              {status === 'scanning' && (
                <div className="scanning-overlay">
                  <div className="scanning-line"></div>
                </div>
              )}
            </motion.div>
            
            <div className="qr-timer">
              <Clock size={14} />
              <span>Expires in {formatTime(countdown)}</span>
            </div>
          </>
        )}
      </div>

      <div className="qr-instructions">
        <h3>Scan with SmartAuth app</h3>
        <div className="qr-steps">
          <div className="qr-step">
            <div className="step-number">1</div>
            <p>Open the SmartAuth mobile app</p>
          </div>
          <div className="qr-step">
            <div className="step-number">2</div>
            <p>Tap on "Scan QR Code" option</p>
          </div>
          <div className="qr-step">
            <div className="step-number">3</div>
            <p>Point your camera at this QR code</p>
          </div>
        </div>

        <div className="qr-hint">
          <Smartphone size={16} />
          <span>Don't have the app? <button className="link">Download now</button></span>
        </div>
      </div>

      {status === 'scanning' && (
        <motion.div 
          className="scanning-status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="scanning-pulse"></div>
          <span>Waiting for confirmation on your device...</span>
        </motion.div>
      )}
    </div>
  );
};

export default QRLogin;
