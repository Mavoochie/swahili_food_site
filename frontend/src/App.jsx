import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import DishList from './components/DishList';
import Login from './components/Login';
import './App.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Swahili<span>Eats</span>
      </Link>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dishes">Dishes</NavLink>
      {token ? (
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      ) : (
        <NavLink to="/login">Login</NavLink>
      )}
    </nav>
  );
}

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
      {/* Background layer */}
      {heroBg
        ? <img src={heroBg} alt="Hero background" className="hero-bg-img" />
        : <div className="hero-placeholder" />
      }
      <div className="hero-bg" />

      {/* Content */}
      <div className="hero-content">
        <h1>Authentic <span>Swahili</span> Cuisine</h1>
        <p>
          Discover the rich coastal flavours of East Africa — from aromatic
          biryanis to creamy coconut curries.
        </p>
        <div className="hero-actions">
          <Link to="/dishes" className="hero-cta">Browse Dishes</Link>
          <label className="hero-upload-label">
            🖼 {heroBg ? 'Change Banner' : 'Upload Banner'}
            <input type="file" accept="image/*" onChange={handleHeroImage} />
          </label>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dishes" element={<DishList />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;