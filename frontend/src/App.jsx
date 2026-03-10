import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BrowserRouter as Router, Routes, Route,
  Link, NavLink, useNavigate, Navigate
} from 'react-router-dom';
import DishList   from './components/DishList';
import DishDetail from './components/DishDetail';
import Login      from './components/Login';
import Register   from './components/Register';
import Report     from './components/Report';
import './App.css';

// ── Session timeout settings ──────────────────────
const TIMEOUT_DURATION = 30 * 60 * 1000;  // 30 minutes inactivity
const WARNING_BEFORE   =  2 * 60 * 1000;  // warn 2 minutes before logout

// ── Protected Route ───────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ── Session Timeout Hook ──────────────────────────
function useSessionTimeout(onLogout) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown]     = useState(120);
  const logoutTimer                   = useRef(null);
  const warningTimer                  = useRef(null);
  const countdownInterval             = useRef(null);

  const clearAllTimers = () => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
    clearInterval(countdownInterval.current);
  };

  const startCountdown = useCallback(() => {
    setCountdown(120);
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownInterval.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTimer = useCallback(() => {
    if (!localStorage.getItem('token')) return;
    clearAllTimers();
    setShowWarning(false);

    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, TIMEOUT_DURATION - WARNING_BEFORE);

    logoutTimer.current = setTimeout(() => {
      setShowWarning(false);
      onLogout();
    }, TIMEOUT_DURATION);
  }, [onLogout, startCountdown]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => resetTimer();

    if (localStorage.getItem('token')) {
      resetTimer();
      events.forEach(e => window.addEventListener(e, handleActivity));
    }

    return () => {
      clearAllTimers();
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, [resetTimer]);

  return { showWarning, countdown, resetTimer };
}

// ── Timeout Warning Modal ─────────────────────────
function TimeoutWarning({ countdown, onStayLoggedIn, onLogoutNow }) {
  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, '0');

  return (
    <div className="timeout-overlay">
      <div className="timeout-modal card">
        <span className="timeout-icon">⏱</span>
        <h3 className="timeout-title">Session Expiring Soon</h3>
        <p className="timeout-message">
          You have been inactive. Your session will expire in:
        </p>
        <p className="timeout-countdown">{minutes}:{seconds}</p>
        <p className="timeout-subtext">
          Click below to stay logged in, otherwise you will be logged out automatically.
        </p>
        <div className="timeout-actions">
          <button className="btn-primary" onClick={onStayLoggedIn}>Stay Logged In</button>
          <button className="btn-logout"  onClick={onLogoutNow}>Logout Now</button>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────
function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const role     = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Swahili<span>Eats</span>
      </Link>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dishes">Dishes</NavLink>
      {token && <NavLink to="/report">Report</NavLink>}
      {token ? (
        <>
          <span className="navbar-user">
            {role === 'admin' ? '👑' : '🧑‍🍳'} {username}
          </span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register" className="nav-register">Join Us</NavLink>
        </>
      )}
    </nav>
  );
}

// ── Home ─────────────────────────────────────────
function Home() {
  const [heroBg, setHeroBg] = useState(null);

  const handleHeroImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setHeroBg(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="hero">
      {heroBg
        ? <img src={heroBg} alt="Hero background" className="hero-bg-img" />
        : <div className="hero-placeholder" />
      }
      <div className="hero-bg" />
      <div className="hero-content">
        <h1>Authentic <span>Swahili</span> Cuisine</h1>
        <p>
          Discover the rich coastal flavours of East Africa — from aromatic
          biryanis to creamy coconut curries.
        </p>
        <div className="hero-actions">
          <Link to="/dishes" className="hero-cta">Browse Dishes</Link>
          {localStorage.getItem('role') === 'admin' && (
            <label className="hero-upload-label">
              🖼 {heroBg ? 'Change Banner' : 'Upload Banner'}
              <input type="file" accept="image/*" onChange={handleHeroImage} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

// ── App / Routes ──────────────────────────────────
function AppContent() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  }, [navigate]);

  const { showWarning, countdown, resetTimer } = useSessionTimeout(handleLogout);

  return (
    <>
      <Navbar onLogout={handleLogout} />

      {showWarning && localStorage.getItem('token') && (
        <TimeoutWarning
          countdown={countdown}
          onStayLoggedIn={resetTimer}
          onLogoutNow={handleLogout}
        />
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/dishes"     element={<DishList />} />
        <Route path="/dishes/:id" element={<DishDetail />} />

        {/* Protected routes */}
        <Route path="/report" element={
          <ProtectedRoute><Report /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;