import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setMsg(data.detail || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      setMsg("Login successful");
    } catch (error) {
      console.error("Network error:", error);
      setMsg("Backend not reachable");
    }
    setIsLoading(false);
  }

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  // Floating particles component
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

  return (
    <div className="main-container">
      <FloatingParticles />
      
      {/* Animated gradient orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="content-wrapper">
        {/* Left side - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <div className="logo-container">
              <div className="logo-icon">
                <Shield size={32} />
              </div>
              <span className="logo-text">SecureAuth</span>
            </div>
            
            <h1 className="brand-title">
              Next-Gen
              <span className="gradient-text"> Authentication</span>
            </h1>
            
            <p className="brand-subtitle">
              Experience seamless, secure access to your digital world with cutting-edge authentication technology.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Zap size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">Lightning Fast</span>
                  <span className="feature-desc">Sub-second authentication</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">Enterprise Security</span>
                  <span className="feature-desc">Bank-grade encryption</span>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Sparkles size={20} />
                </div>
                <div className="feature-text">
                  <span className="feature-title">AI-Powered</span>
                  <span className="feature-desc">Smart threat detection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Card */}
        <div className="auth-section">
          <div className="card">
            <div className="card-header">
              <h2 className="title">Sign in to your account</h2>
              <p className="subtitle">Enter your credentials to continue your journey</p>
            </div>

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
              <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${email ? 'has-value' : ''}`}>
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

              <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${password ? 'has-value' : ''}`}>
                <div className="label-row">
                  <label className="label">Password</label>
                  <a href="#" className="forgot-password">Forgot password?</a>
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
                  <span className="checkbox-label">Remember me for 30 days</span>
                </label>
              </div>

              <button 
                className={`submit-btn ${isLoading ? 'loading' : ''}`} 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={18} className="btn-icon" />
                  </>
                )}
              </button>

              {msg && (
                <div className={`message ${msg.includes("success") ? "success" : "error"}`}>
                  <span>{msg}</span>
                </div>
              )}
            </div>

            <div className="footer">
              <span>Don't have an account?</span>
              <a href="#" className="link">Create account</a>
            </div>

            <div className="terms">
              By continuing, you agree to our{" "}
              <a href="#" className="terms-link">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="terms-link">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
