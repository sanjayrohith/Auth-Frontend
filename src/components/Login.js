import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Github, ArrowRight, Shield, Zap,
  Fingerprint, Smartphone, QrCode, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import QRLogin from './QRLogin';
import './Login.css';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [authMethod, setAuthMethod] = useState('credentials'); // credentials, passkey, qr
  const [passkeySupported, setPasskeySupported] = useState(false);

  const { login, loginWithPasskey, trustScore, deviceInfo } = useAuth();

  useEffect(() => {
    // Check WebAuthn support
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setPasskeySupported(available));
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setMsg({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    setIsLoading(false);

    if (result.success) {
      setTimeout(() => onNavigate('dashboard'), 1000);
    }
  };

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    const result = await loginWithPasskey();
    setMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    setIsLoading(false);

    if (result.success) {
      setTimeout(() => onNavigate('dashboard'), 1000);
    }
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  const FloatingParticles = () => (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );

  const getTrustBadge = () => {
    if (trustScore >= 80) return { text: 'High Trust', color: '#10b981', icon: '🛡️' };
    if (trustScore >= 50) return { text: 'Medium Trust', color: '#f59e0b', icon: '⚡' };
    return { text: 'New Device', color: '#6366f1', icon: '🔍' };
  };

  const trustBadge = getTrustBadge();

  return (
    <div className="main-container">
      <FloatingParticles />
      
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="content-wrapper">
        {/* Left side - Branding */}
        <div className="branding-section">
          <motion.div 
            className="brand-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="logo-container">
              <div className="logo-icon">
                <Shield size={32} />
              </div>
              <span className="logo-text">SmartAuth</span>
            </div>
            
            <h1 className="brand-title">
              Next-Gen
              <span className="gradient-text"> Authentication</span>
            </h1>
            
            <p className="brand-subtitle">
              Experience seamless, secure access with adaptive authentication that learns and protects.
            </p>

            <div className="features-list">
              <motion.div 
                className="feature-item"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">
                  <Fingerprint size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">Passkey Authentication</span>
                  <span className="feature-desc">Login with fingerprint or Face ID</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="feature-item"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">
                  <QrCode size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">QR Code Login</span>
                  <span className="feature-desc">Scan with your mobile device</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="feature-item"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">
                  <Zap size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">Adaptive Security</span>
                  <span className="feature-desc">Smart risk-based authentication</span>
                </div>
              </motion.div>
            </div>

            {/* Trust Score Indicator */}
            {deviceInfo && (
              <motion.div 
                className="trust-indicator"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="trust-header">
                  <span>Device Trust Score</span>
                  <span className="trust-badge" style={{ background: trustBadge.color }}>
                    {trustBadge.icon} {trustBadge.text}
                  </span>
                </div>
                <div className="trust-bar">
                  <motion.div 
                    className="trust-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${trustScore}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    style={{ 
                      background: `linear-gradient(90deg, ${trustBadge.color}, ${trustBadge.color}88)` 
                    }}
                  />
                </div>
                <div className="trust-details">
                  <span>{deviceInfo.browser} • {deviceInfo.os}</span>
                  <span>{trustScore}%</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right side - Auth Card */}
        <div className="auth-section">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-header">
              <h2 className="title">Sign in to your account</h2>
              <p className="subtitle">Choose your preferred authentication method</p>
            </div>

            {/* Auth Method Tabs */}
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMethod === 'credentials' ? 'active' : ''}`}
                onClick={() => setAuthMethod('credentials')}
              >
                <Mail size={16} />
                <span>Email</span>
              </button>
              {passkeySupported && (
                <button 
                  className={`auth-tab ${authMethod === 'passkey' ? 'active' : ''}`}
                  onClick={() => setAuthMethod('passkey')}
                >
                  <Fingerprint size={16} />
                  <span>Passkey</span>
                </button>
              )}
              <button 
                className={`auth-tab ${authMethod === 'qr' ? 'active' : ''}`}
                onClick={() => setAuthMethod('qr')}
              >
                <QrCode size={16} />
                <span>QR Code</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {authMethod === 'credentials' && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="social-buttons">
                    <button className="social-btn google-btn">
                      <GoogleIcon />
                      <span>Google</span>
                    </button>
                    <button className="social-btn github-btn">
                      <Github size={18} />
                      <span>GitHub</span>
                    </button>
                  </div>

                  <div className="divider">
                    <div className="divider-line"></div>
                    <span className="divider-text">or continue with email</span>
                    <div className="divider-line"></div>
                  </div>

                  <div className="form-container">
                    <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
                      <label className="label">Email address</label>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          className="input-field"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <div className="input-glow"></div>
                      </div>
                    </div>

                    <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
                      <div className="label-row">
                        <label className="label">Password</label>
                        <button className="forgot-password" onClick={() => onNavigate('forgot-password')}>
                          Forgot password?
                        </button>
                      </div>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="input-field"
                          placeholder="••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <button
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <div className="input-glow"></div>
                      </div>
                    </div>

                    <div className="remember-me">
                      <label className="checkbox-container">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        <span className="checkbox-label">Remember this device</span>
                      </label>
                    </div>

                    <motion.button 
                      className={`submit-btn ${isLoading ? 'loading' : ''}`} 
                      onClick={handleLogin}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="loader"></div>
                      ) : (
                        <>
                          <span>Sign in</span>
                          <ArrowRight size={18} className="btn-icon" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {authMethod === 'passkey' && (
                <motion.div
                  key="passkey"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="passkey-section"
                >
                  <div className="passkey-icon-container">
                    <motion.div 
                      className="passkey-icon"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Fingerprint size={64} />
                    </motion.div>
                  </div>
                  
                  <h3 className="passkey-title">Use your passkey</h3>
                  <p className="passkey-desc">
                    Authenticate using your device's biometric sensor - fingerprint or face recognition.
                  </p>

                  <motion.button 
                    className="submit-btn passkey-btn"
                    onClick={handlePasskeyLogin}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        <Fingerprint size={20} />
                        <span>Authenticate with Passkey</span>
                      </>
                    )}
                  </motion.button>

                  <p className="passkey-hint">
                    <Smartphone size={14} />
                    Make sure your device supports biometric authentication
                  </p>
                </motion.div>
              )}

              {authMethod === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <QRLogin onSuccess={() => onNavigate('dashboard')} />
                </motion.div>
              )}
            </AnimatePresence>

            {msg.text && (
              <motion.div 
                className={`message ${msg.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{msg.text}</span>
              </motion.div>
            )}

            <div className="footer">
              <span>Don't have an account?</span>
              <button className="link" onClick={() => onNavigate('signup')}>Create account</button>
            </div>

            <div className="terms">
              By continuing, you agree to our{" "}
              <button className="terms-link">Terms of Service</button>
              {" "}and{" "}
              <button className="terms-link">Privacy Policy</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
