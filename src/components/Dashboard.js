import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Monitor, Smartphone, Tablet, MapPin, Clock, 
  Trash2, CheckCircle, AlertTriangle, Globe, Wifi, X,
  Fingerprint, Key, Settings, LogOut, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ onNavigate }) => {
  const { user, deviceInfo, trustScore, logout, registerPasskey } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showRevokeModal, setShowRevokeModal] = useState(null);
  const [passkeyStatus, setPasskeyStatus] = useState('');

  // Mock sessions data - in production, fetch from backend
  const [sessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      ip: '192.168.1.xxx',
      lastActive: 'Active now',
      isCurrent: true,
      trusted: true,
      icon: 'desktop'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, USA',
      ip: '192.168.1.xxx',
      lastActive: '2 hours ago',
      isCurrent: false,
      trusted: true,
      icon: 'mobile'
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'San Francisco, USA',
      ip: '10.0.0.xxx',
      lastActive: '3 days ago',
      isCurrent: false,
      trusted: false,
      icon: 'desktop'
    }
  ]);

  const [securityEvents] = useState([
    { id: 1, type: 'success', message: 'Successful login from Chrome', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'New device detected', time: '2 hours ago' },
    { id: 3, type: 'success', message: 'Password changed successfully', time: '1 day ago' },
    { id: 4, type: 'error', message: 'Failed login attempt blocked', time: '3 days ago' },
  ]);

  const handleRegisterPasskey = async () => {
    setPasskeyStatus('registering');
    const result = await registerPasskey();
    setPasskeyStatus(result.success ? 'success' : 'error');
    setTimeout(() => setPasskeyStatus(''), 3000);
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile': return <Smartphone size={24} />;
      case 'tablet': return <Tablet size={24} />;
      default: return <Monitor size={24} />;
    }
  };

  const getTrustColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container small">
            <div className="logo-icon small">
              <Shield size={20} />
            </div>
            <span className="logo-text">SmartAuth</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Shield size={20} />
            <span>Security Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <Monitor size={20} />
            <span>Active Sessions</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'passkeys' ? 'active' : ''}`}
            onClick={() => setActiveTab('passkeys')}
          >
            <Fingerprint size={20} />
            <span>Passkeys</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-email">{user?.email || 'user@example.com'}</span>
              <span className="user-status">Verified</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dashboard-content"
            >
              <header className="content-header">
                <h1>Security Overview</h1>
                <p>Monitor your account security and manage trusted devices</p>
              </header>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Shield size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{trustScore}%</span>
                    <span className="stat-label">Trust Score</span>
                  </div>
                  <div className="stat-trend positive">↑ 5%</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <Monitor size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{sessions.length}</span>
                    <span className="stat-label">Active Sessions</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <Key size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">1</span>
                    <span className="stat-label">Passkeys</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                    <Globe size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">2</span>
                    <span className="stat-label">Locations</span>
                  </div>
                </div>
              </div>

              {/* Trust Score Details */}
              <div className="card-section">
                <h2>Device Trust Analysis</h2>
                <div className="trust-analysis">
                  <div className="trust-score-circle">
                    <svg viewBox="0 0 100 100">
                      <circle 
                        className="trust-bg" 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="8"
                      />
                      <motion.circle 
                        className="trust-progress" 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke={getTrustColor(trustScore)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${trustScore * 2.83} 283`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${trustScore * 2.83} 283` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="trust-score-text">
                      <span className="score">{trustScore}</span>
                      <span className="label">Trust</span>
                    </div>
                  </div>

                  <div className="trust-factors">
                    <div className="factor-item">
                      <div className="factor-info">
                        <Monitor size={18} />
                        <span>Known Device</span>
                      </div>
                      <div className={`factor-status ${deviceInfo ? 'positive' : 'negative'}`}>
                        {deviceInfo ? '+30 pts' : '+0 pts'}
                      </div>
                    </div>
                    <div className="factor-item">
                      <div className="factor-info">
                        <Clock size={18} />
                        <span>Login Time</span>
                      </div>
                      <div className="factor-status positive">+10 pts</div>
                    </div>
                    <div className="factor-item">
                      <div className="factor-info">
                        <MapPin size={18} />
                        <span>Known Location</span>
                      </div>
                      <div className="factor-status positive">+10 pts</div>
                    </div>
                    <div className="factor-item">
                      <div className="factor-info">
                        <Wifi size={18} />
                        <span>Base Score</span>
                      </div>
                      <div className="factor-status neutral">50 pts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-section">
                <h2>Recent Security Events</h2>
                <div className="activity-list">
                  {securityEvents.map((event, index) => (
                    <motion.div 
                      key={event.id}
                      className={`activity-item ${event.type}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`activity-icon ${event.type}`}>
                        {event.type === 'success' && <CheckCircle size={18} />}
                        {event.type === 'warning' && <AlertTriangle size={18} />}
                        {event.type === 'error' && <X size={18} />}
                      </div>
                      <div className="activity-info">
                        <span className="activity-message">{event.message}</span>
                        <span className="activity-time">{event.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <motion.div
              key="sessions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dashboard-content"
            >
              <header className="content-header">
                <h1>Active Sessions</h1>
                <p>Manage devices that have access to your account</p>
              </header>

              <div className="sessions-list">
                {sessions.map((session, index) => (
                  <motion.div 
                    key={session.id}
                    className={`session-card ${session.isCurrent ? 'current' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="session-icon">
                      {getDeviceIcon(session.icon)}
                    </div>
                    
                    <div className="session-info">
                      <div className="session-header">
                        <span className="session-device">{session.device}</span>
                        {session.isCurrent && (
                          <span className="current-badge">This device</span>
                        )}
                        {session.trusted && !session.isCurrent && (
                          <span className="trusted-badge">Trusted</span>
                        )}
                      </div>
                      <div className="session-details">
                        <span><MapPin size={14} /> {session.location}</span>
                        <span><Globe size={14} /> {session.ip}</span>
                        <span><Clock size={14} /> {session.lastActive}</span>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button 
                        className="revoke-btn"
                        onClick={() => setShowRevokeModal(session)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <button className="danger-btn">
                <LogOut size={18} />
                <span>Sign out all other sessions</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'passkeys' && (
            <motion.div
              key="passkeys"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dashboard-content"
            >
              <header className="content-header">
                <h1>Passkeys</h1>
                <p>Manage passwordless authentication methods</p>
              </header>

              <div className="passkey-info-card">
                <div className="passkey-illustration">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Fingerprint size={64} />
                  </motion.div>
                </div>
                <div className="passkey-content">
                  <h3>What are Passkeys?</h3>
                  <p>
                    Passkeys are a more secure and convenient alternative to passwords. 
                    They use biometric authentication (fingerprint or face recognition) 
                    built into your device.
                  </p>
                  <ul className="passkey-benefits">
                    <li><CheckCircle size={16} /> No passwords to remember</li>
                    <li><CheckCircle size={16} /> Resistant to phishing attacks</li>
                    <li><CheckCircle size={16} /> Faster sign-in experience</li>
                    <li><CheckCircle size={16} /> Works across devices</li>
                  </ul>
                </div>
              </div>

              <div className="card-section">
                <div className="section-header">
                  <h2>Your Passkeys</h2>
                  <motion.button 
                    className="add-passkey-btn"
                    onClick={handleRegisterPasskey}
                    disabled={passkeyStatus === 'registering'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {passkeyStatus === 'registering' ? (
                      <div className="loader small"></div>
                    ) : passkeyStatus === 'success' ? (
                      <>
                        <CheckCircle size={18} />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint size={18} />
                        <span>Add Passkey</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {localStorage.getItem('passkeyCredentialId') ? (
                  <div className="passkey-list">
                    <div className="passkey-item">
                      <div className="passkey-icon">
                        <Fingerprint size={24} />
                      </div>
                      <div className="passkey-details">
                        <span className="passkey-name">{deviceInfo?.browser} on {deviceInfo?.os}</span>
                        <span className="passkey-date">Added today</span>
                      </div>
                      <button className="delete-passkey">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <Key size={48} />
                    <p>No passkeys registered yet</p>
                    <span>Add a passkey to enable passwordless login</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dashboard-content"
            >
              <header className="content-header">
                <h1>Security Settings</h1>
                <p>Configure your account security preferences</p>
              </header>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Login Notifications</h3>
                    <p>Get notified when someone logs into your account</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Suspicious Activity Alerts</h3>
                    <p>Receive alerts for unusual account activity</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item clickable">
                  <div className="setting-info">
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                  <ChevronRight size={20} />
                </div>

                <div className="setting-item clickable danger">
                  <div className="setting-info">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <ChevronRight size={20} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Revoke Session Modal */}
      <AnimatePresence>
        {showRevokeModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRevokeModal(null)}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-icon warning">
                <AlertTriangle size={32} />
              </div>
              <h3>Revoke Session?</h3>
              <p>
                This will sign out the device "{showRevokeModal.device}" 
                from your account. They will need to sign in again.
              </p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowRevokeModal(null)}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={() => setShowRevokeModal(null)}>
                  Revoke Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
