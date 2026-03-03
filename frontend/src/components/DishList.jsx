import React, { useEffect, useState } from 'react';
import { getDishes, deleteDish, updateDish, getCommunityPhotos, createCommunityPhoto } from '../api/api';
import DishForm from './DishForm';
import EditDishForm from './EditDishForm';
import Comments from './Comments';

// ── Community photos section shown under each dish ──
function CommunityPhotos({ dishId }) {
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    getCommunityPhotos(dishId)
      .then(res => setPhotos(res.data))
      .catch(() => {});
  }, [dishId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('dish', dishId);
      formData.append('photo', file);
      const res = await createCommunityPhoto(formData);
      setPhotos(prev => [res.data, ...prev]);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="community-section">
      <div className="community-header">
        <span className="community-title">👨‍🍳 Community Cooks</span>
        <span className="comments-count">{photos.length}</span>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="community-grid">
          {photos.map(p => (
            <div key={p.id} className="community-photo">
              <img src={p.photo} alt="Community cook" />
              <span className="community-author">@{p.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* One-click upload — logged in users only */}
      {token ? (
        <div className="community-upload">
          <label className="community-upload-btn">
            {loading ? 'Uploading…' : '📷 Share your cook'}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
          {error && <p className="msg-error">{error}</p>}
        </div>
      ) : (
        <p className="comment-login-note">
          <a href="/login">Sign in</a> to share your cook.
        </p>
      )}
    </div>
  );
}

// ── Main DishList ──
function DishList() {
  const [dishes, setDishes]       = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token   = localStorage.getItem('token');
  const role    = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    getDishes().then(res => setDishes(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this dish?')) return;
    try {
      await deleteDish(id);
      setDishes(dishes.filter(d => d.id !== id));
    } catch {
      alert('Failed to delete dish.');
    }
  };

  // Admin uploads the official dish image
  const handleDishImageUpload = async (dish, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', dish.name);
      formData.append('description', dish.description);
      formData.append('price', dish.price);
      const res = await updateDish(dish.id, formData);
      setDishes(prev => prev.map(d => d.id === dish.id ? res.data : d));
    } catch {
      alert('Image upload failed.');
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

      {/* Stats bar */}
      <div className="dish-stats">
        <div className="stat-item">
          <span className="stat-value">{totalDishes}</span>
          <span className="stat-label">Total Dishes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{avgPrice} <small>KES</small></span>
          <span className="stat-label">Avg. Price</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{maxPrice} <small>KES</small></span>
          <span className="stat-label">Highest Price</span>
        </div>
      </div>

      <h2 className="section-title">Our Menu</h2>

      <div className="dish-grid">
        {dishes.map(d => (
          <div key={d.id} className="dish-card card">
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
              <>
                {/* Official dish image — admin upload only */}
                <div className="dish-image-wrapper">
                  {d.image
                    ? <img src={`http://localhost:8000${d.image}`} alt={d.name} />
                    : (
                      <div className="dish-img-placeholder">
                        <span>🍽</span>
                        {isAdmin && <p>No photo yet</p>}
                      </div>
                    )
                  }
                  {isAdmin && (
                    <label className="dish-upload-btn">
                      📷 {d.image ? 'Change photo' : 'Add photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDishImageUpload(d, e)}
                      />
                    </label>
                  )}
                </div>

                {/* Dish info */}
                <div className="dish-body">
                  <div className="dish-info">
                    <h3 className="dish-name">{d.name}</h3>
                    <p className="dish-desc">{d.description}</p>
                  </div>
                  <div className="dish-footer">
                    <span className="dish-price">{d.price} KES</span>
                    {isAdmin && (
                      <div className="dish-actions">
                        <button className="btn-secondary" onClick={() => setEditingId(d.id)}>Edit</button>
                        <button className="btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
                      </div>
                    )}
                  </div>

                  <Comments dishId={d.id} />
                  <CommunityPhotos dishId={d.id} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add dish form — admin only */}
      {isAdmin ? (
        <div className="add-dish-section">
          <h3>Add a New Dish</h3>
          <DishForm onDishAdded={(dish) => setDishes([...dishes, dish])} />
        </div>
      ) : token ? null : (
        <p className="login-prompt">
          <a href="/login">Sign in</a> to interact with dishes.
        </p>
      )}
    </div>
  );
}

export default DishList;