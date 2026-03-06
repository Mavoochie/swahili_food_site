import React, { useEffect, useState } from 'react';
import { getDishes, getComments } from '../api/api';

function Report() {
  const [dishes, setDishes]     = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);

  const role     = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const dishRes   = await getDishes();
        const allDishes = dishRes.data;
        setDishes(allDishes);

        const commentResults = await Promise.all(
          allDishes.map(d => getComments(d.id))
        );
        const allComments = commentResults.flatMap(r => r.data);
        setComments(allComments);
      } catch {
        console.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p className="page-loader">Loading report...</p>;

  // Calculations
  const totalDishes   = dishes.length;
  const totalComments = comments.length;
  const avgPrice      = totalDishes > 0
    ? (dishes.reduce((sum, d) => sum + parseFloat(d.price), 0) / totalDishes).toFixed(2)
    : '0.00';
  const mostExpensive = totalDishes > 0
    ? dishes.reduce((a, b) => parseFloat(a.price) > parseFloat(b.price) ? a : b)
    : null;
  const cheapest = totalDishes > 0
    ? dishes.reduce((a, b) => parseFloat(a.price) < parseFloat(b.price) ? a : b)
    : null;

  // Comment count per dish
  const commentsPerDish = dishes.map(d => ({
    name: d.name,
    count: comments.filter(c => c.dish === d.id).length,
    price: parseFloat(d.price),
  }));
  const mostDiscussed = [...commentsPerDish].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="report-page">

      {/* Header */}
      <div className="report-header">
        <p className="eyebrow">System Report</p>
        <h2>SwahiliEats — Summary Report</h2>
        <p className="report-meta">
          Generated on {new Date().toLocaleDateString('en-KE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })} &nbsp;·&nbsp; Viewed by{' '}
          <strong>{role === 'admin' ? '👑' : '🧑‍🍳'} {username}</strong>
        </p>
        <div className="section-divider"></div>
      </div>

      {/* Summary Cards */}
      <div className="report-cards">
        <div className="report-card">
          <span className="report-card-icon">🍽</span>
          <span className="report-card-value">{totalDishes}</span>
          <span className="report-card-label">Total Dishes</span>
        </div>
        <div className="report-card">
          <span className="report-card-icon">💬</span>
          <span className="report-card-value">{totalComments}</span>
          <span className="report-card-label">Total Comments</span>
        </div>
        <div className="report-card">
          <span className="report-card-icon">📊</span>
          <span className="report-card-value">KES {avgPrice}</span>
          <span className="report-card-label">Average Price</span>
        </div>
        <div className="report-card">
          <span className="report-card-icon">🔥</span>
          <span className="report-card-value">{mostDiscussed?.name || '—'}</span>
          <span className="report-card-label">Most Discussed</span>
        </div>
      </div>

      {/* Dish Table */}
      <div className="report-section">
        <h3>Dish Breakdown</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dish Name</th>
              <th>Price (KES)</th>
              <th>Comments</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {commentsPerDish.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.name}</td>
                <td>{d.price.toFixed(2)}</td>
                <td>{d.count}</td>
                <td>
                  <span className={`report-badge ${d.count > 0 ? 'active' : 'quiet'}`}>
                    {d.count > 0 ? 'Active' : 'No reviews'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price Highlights */}
      <div className="report-section">
        <h3>Price Highlights</h3>
        <div className="report-highlights">
          <div className="highlight-item">
            <span className="highlight-label">Most Expensive</span>
            <span className="highlight-value">{mostExpensive?.name} — KES {mostExpensive?.price}</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-label">Most Affordable</span>
            <span className="highlight-value">{cheapest?.name} — KES {cheapest?.price}</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-label">Average Price</span>
            <span className="highlight-value">KES {avgPrice}</span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="report-footer-note">
        This report is auto-generated from live system data. Only authenticated users can access this page.
      </p>

    </div>
  );
}

export default Report;