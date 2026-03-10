import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDish } from '../api/api';
import Comments from './Comments';

function DishDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [dish, setDish]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    getDish(id)
      .then(res => setDish(res.data))
      .catch(() => setError('Failed to load dish.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="page-loader">Loading dish...</p>;
  if (error)   return <p className="msg-error" style={{ padding: '2rem' }}>{error}</p>;
  if (!dish)   return null;

  return (
    <div className="dish-detail-page">

      {/* Back button */}
      <button className="btn-secondary dish-detail-back" onClick={() => navigate('/dishes')}>
        ← Back to Dishes
      </button>

      {/* Hero image */}
      <div className="dish-detail-hero">
        {dish.image
          ? <img src={dish.image} alt={dish.name} className="dish-detail-img" />
          : <div className="dish-detail-img-placeholder"><span>🍽</span></div>
        }
        <div className="dish-detail-hero-overlay">
          <span className="dish-tag">Swahili Dish</span>
          <h1 className="dish-detail-title">{dish.name}</h1>
          <span className="dish-detail-price">{dish.price} KES</span>
        </div>
      </div>

      <div className="dish-detail-body">

        {/* Description */}
        <div className="dish-detail-section">
          <h2 className="dish-detail-section-title">About this Dish</h2>
          <p className="dish-detail-text">{dish.description || 'No description available.'}</p>
        </div>

        {/* Cultural Notes */}
        {dish.cultural_notes && (
          <div className="dish-detail-section dish-detail-cultural">
            <h2 className="dish-detail-section-title">
              <span className="dish-detail-icon">🏛</span> Cultural &amp; Historical Notes
            </h2>
            <p className="dish-detail-text">{dish.cultural_notes}</p>
          </div>
        )}

        {/* Preparation Steps */}
        {dish.preparation_steps && (
          <div className="dish-detail-section">
            <h2 className="dish-detail-section-title">
              <span className="dish-detail-icon">👨‍🍳</span> Preparation Steps
            </h2>
            <div className="dish-detail-steps">
              {dish.preparation_steps.split('\n').filter(s => s.trim()).map((step, i) => (
                <div key={i} className="dish-detail-step">
                  <span className="step-number">{i + 1}</span>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="dish-detail-section">
          <h2 className="dish-detail-section-title">
            <span className="dish-detail-icon">💬</span> Community Comments
          </h2>
          <Comments dishId={dish.id} />
        </div>

      </div>
    </div>
  );
}

export default DishDetail;