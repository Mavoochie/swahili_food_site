import React, { useState } from 'react';
import {
  BrowserRouter as Router, Routes, Route,
  Link, NavLink, useNavigate, Navigate
} from 'react-router-dom';
import DishList  from './components/DishList';
import Login     from './components/Login';
import Register  from './components/Register';
import Report    from './components/Report';
import './App.css';

// ── Protected Route ──────────────────────────────
// Redirects to /login if user has no token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ── Navbar ───────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const role     = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
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
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — redirect to /login if not logged in */}
        <Route path="/dishes" element={
          <ProtectedRoute><DishList /></ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute><Report /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;