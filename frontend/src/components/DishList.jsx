import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDishes, deleteDish, uploadDishImage } from '../api/api';
import DishForm     from './DishForm';
import EditDishForm from './EditDishForm';
import Comments     from './Comments';

function DishList() {
  const [dishes, setDishes]           = useState([]);
  const [editingId, setEditingId]     = useState(null);
  const [confirmId, setConfirmId]     = useState(null);
  const [confirmName, setConfirmName] = useState('');
  const fileInputRefs                 = useRef({});

  const token   = localStorage.getItem('token');
  const role    = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    getDishes().then(res => setDishes(res.data));
  }, []);

  // Delete confirmation
  const handleDeleteClick = (id, name) => {
    setConfirmId(id);
    setConfirmName(name);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDish(confirmId);
      setDishes(dishes.filter(d => d.id !== confirmId));
    } catch {
      alert('Failed to delete dish.');
    } finally {
      setConfirmId(null);
      setConfirmName('');
    }
  };

  const handleCancelDelete = () => {
    setConfirmId(null);
    setConfirmName('');
  };

  const handleImageUpload = async (dishId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadDishImage(dishId, file);
      setDishes(prev =>
        prev.map(d => d.id === dishId ? { ...d, image: res.data.image } : d)
      );
    } catch {
      alert('Failed to upload image. Make sure you are logged in as admin.');
    }
  };

  const totalDishes = dishes.length;
  const avgPrice = totalDishes > 0
    ? (dishes.reduce((sum, d) => sum + parseFloat(d.price), 0) / totalDishes).toFixed(2)
    : '0.00';
  const maxPrice = totalDishes > 0
    ? Math.max(...dishes.map(d => parseFloat(d.price))).toFixed(2)
    : '0.00';

  return (
    <div className="dishlist">

      {/* ── Delete Confirmation Modal ── */}
      {confirmId && (
        <div className="timeout-overlay">
          <div className="timeout-modal card">
            <span className="timeout-icon">🗑</span>
            <h3 className="timeout-title">Delete Dish</h3>
            <p className="timeout-message">
              Are you sure you want to remove <strong>{confirmName}</strong> from the menu?
            </p>
            <p className="timeout-subtext">This action cannot be undone.</p>
            <div className="timeout-actions">
              <button className="btn-secondary" onClick={handleCancelDelete}>Cancel</button>
              <button className="btn-danger"    onClick={handleConfirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="dish-stats">
        <div className="stat-item">
          <span className="stat-value">{totalDishes}</span>
          <span className="stat-label">Dishes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{avgPrice} <small>KES</small></span>
          <span className="stat-label">Avg. Price</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{maxPrice} <small>KES</small></span>
          <span className="stat-label">Top Price</span>
        </div>
      </div>

      {/* Section header */}
      <div className="section-intro">
        <p className="eyebrow">Coastal Dishes</p>
        <h2 className="section-title">Our Menu</h2>
        <div className="section-divider"></div>
      </div>

      {/* Dish list */}
      <div className="dish-list">
        {dishes.map(d => (
          <div key={d.id} className="dish-card">
            {editingId === d.id ? (
              <EditDishForm
                dish={d}
                onUpdated={(updated) => {
                  setDishes(dishes.map(x => x.id === d.id ? updated : x));
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="dish-card-inner">

                {/* LEFT — image + info */}
                <div className="dish-left">
                  <div className="dish-image-wrapper">
                    {d.image
                      ? <img src={d.image} alt={d.name} />
                      : (
                        <div className="dish-img-placeholder">
                          <span>🍽</span>
                          <p>No photo yet</p>
                        </div>
                      )
                    }
                    <span className="dish-tag">Dish</span>

                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={el => fileInputRefs.current[d.id] = el}
                      onChange={(e) => handleImageUpload(d.id, e)}
                    />

                    {isAdmin && (
                      <button
                        className="dish-upload-btn"
                        onClick={() => fileInputRefs.current[d.id]?.click()}
                      >
                        📷 {d.image ? 'Change Photo' : 'Add Photo'}
                      </button>
                    )}
                  </div>

                  <div className="dish-body">
                    <div className="dish-info">
                      <h3 className="dish-name">{d.name}</h3>
                      <p className="dish-desc">{d.description}</p>
                    </div>
                    <div className="dish-footer">
                      <span className="dish-price">{d.price} KES</span>
                      <div className="dish-actions">
                        {/* View Details — visible to everyone */}
                        <Link to={`/dishes/${d.id}`} className="btn-secondary">
                          View Details
                        </Link>
                        {isAdmin && (
                          <>
                            <button className="btn-secondary" onClick={() => setEditingId(d.id)}>
                              Edit
                            </button>
                            <button className="btn-danger" onClick={() => handleDeleteClick(d.id, d.name)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — comments */}
                <div className="dish-right">
                  <Comments dishId={d.id} />
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* Admin: add dish */}
      {isAdmin ? (
        <div className="add-dish-section">
          <h3>Add a New Dish</h3>
          <DishForm onDishAdded={(dish) => setDishes([...dishes, dish])} />
        </div>
      ) : !token ? (
        <p className="login-prompt">
          <Link to="/login">Sign in</Link> or{' '}
          <Link to="/register">create an account</Link> to join the conversation.
        </p>
      ) : null}

    </div>
  );
}

export default DishList;