import { createContext, useContext, useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize device fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        const device = {
          fingerprint: result.visitorId,
          browser: getBrowserInfo(),
          os: getOSInfo(),
          screen: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          timestamp: new Date().toISOString(),
        };
        
        setDeviceInfo(device);
        calculateTrustScore(device);
      } catch (error) {
        console.error('Fingerprint error:', error);
      }
      setLoading(false);
    };

    initFingerprint();
    loadStoredAuth();
  }, []);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  const calculateTrustScore = (device) => {
    let score = 50; // Base score
    
    // Check if device is known (stored in localStorage)
    const trustedDevices = JSON.parse(localStorage.getItem('trustedDevices') || '[]');
    const isKnownDevice = trustedDevices.some(d => d.fingerprint === device.fingerprint);
    
    if (isKnownDevice) score += 30;
    
    // Check reasonable time (6 AM - 11 PM)
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 23) score += 10;
    
    // Check if timezone matches previous logins
    const lastTimezone = localStorage.getItem('lastTimezone');
    if (lastTimezone === device.timezone) score += 10;
    
    setTrustScore(Math.min(score, 100));
    return score;
  };

  const loadStoredAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceInfo }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.detail || 'Login failed' };
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user || { email }));
      localStorage.setItem('lastTimezone', deviceInfo?.timezone);
      
      setUser(data.user || { email });
      setIsAuthenticated(true);
      
      // Add device to trusted list
      addTrustedDevice();
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const addTrustedDevice = () => {
    if (!deviceInfo) return;
    
    const trustedDevices = JSON.parse(localStorage.getItem('trustedDevices') || '[]');
    const exists = trustedDevices.some(d => d.fingerprint === deviceInfo.fingerprint);
    
    if (!exists) {
      trustedDevices.push({
        ...deviceInfo,
        trustedAt: new Date().toISOString(),
      });
      localStorage.setItem('trustedDevices', JSON.stringify(trustedDevices));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const revokeSession = (sessionId) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    // In real app, call backend to revoke session
  };

  // WebAuthn / Passkey functions
  const registerPasskey = async () => {
    if (!window.PublicKeyCredential) {
      return { success: false, message: 'WebAuthn not supported' };
    }

    try {
      // In production, get this from your backend
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Smart Auth",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: user?.email || "user@example.com",
          displayName: user?.email || "User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },   // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      // Store credential ID for future authentication
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      localStorage.setItem('passkeyCredentialId', credentialId);
      
      return { success: true, message: 'Passkey registered successfully' };
    } catch (error) {
      console.error('Passkey registration error:', error);
      return { success: false, message: error.message };
    }
  };

  const loginWithPasskey = async () => {
    if (!window.PublicKeyCredential) {
      return { success: false, message: 'WebAuthn not supported' };
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (assertion) {
        // In production, verify this with your backend
        setIsAuthenticated(true);
        return { success: true, message: 'Passkey authentication successful' };
      }
      
      return { success: false, message: 'Authentication failed' };
    } catch (error) {
      console.error('Passkey login error:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    deviceInfo,
    sessions,
    trustScore,
    loading,
    login,
    logout,
    revokeSession,
    registerPasskey,
    loginWithPasskey,
    addTrustedDevice,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
