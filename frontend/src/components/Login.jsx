import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await loginUser({ username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username);
      setIsError(false);
      setMessage('Login successful! Redirecting…');
      setTimeout(() => (window.location.href = '/dishes'), 1000);
    } catch {
      setIsError(true);
      setMessage('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card card">
        <div className="login-header">
          <h2>Welcome back</h2>
          <p>Sign in to manage your dishes</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {message && (
            <p className={isError ? 'msg-error' : 'msg-success'}>{message}</p>
          )}

          <button
            type="submit"
            className="btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />
        <p className="login-footer">
          Just browsing? <Link to="/dishes">View dishes</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;