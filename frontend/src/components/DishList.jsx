import React, { useEffect, useState } from 'react';
import { getDishes, deleteDish } from '../api/api';
import DishForm from './DishForm';
import EditDishForm from './EditDishForm';
import Comments from './Comments';

function DishList() {
  const [dishes, setDishes]       = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dishImages, setDishImages] = useState({});  // { [dishId]: dataURL }
  const token = localStorage.getItem('token');

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

  const handleImageUpload = (dishId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setDishImages(prev => ({ ...prev, [dishId]: ev.target.result }));
    reader.readAsDataURL(file);
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

      {/* Dish grid */}
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
                {/* Dish image */}
                <div className="dish-image-wrapper">
                  {dishImages[d.id]
                    ? <img src={dishImages[d.id]} alt={d.name} />
                    : (
                      <div className="dish-img-placeholder">
                        <span>🍽</span>
                        <p>No photo yet</p>
                      </div>
                    )
                  }
                  <label className="dish-upload-btn">
                    📷 Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(d.id, e)}
                    />
                  </label>
                </div>

                {/* Dish info */}
                <div className="dish-body">
                  <div className="dish-info">
                    <h3 className="dish-name">{d.name}</h3>
                    <p className="dish-desc">{d.description}</p>
                  </div>
                  <div className="dish-footer">
                    <span className="dish-price">{d.price} KES</span>
                    {token && (
                      <div className="dish-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => setEditingId(d.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(d.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <Comments dishId={d.id} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add dish form */}
      {token ? (
        <div className="add-dish-section">
          <h3>Add a New Dish</h3>
          <DishForm onDishAdded={(dish) => setDishes([...dishes, dish])} />
        </div>
      ) : (
        <p className="login-prompt">
          <a href="/login">Sign in</a> to add or edit dishes.
        </p>
      )}
    </div>
  );
}

export default DishList;